---
title: The Secret iOS Database Syncing Option You Didn’t Know About, for iPad on Swift Playgrounds &amp; Beyond
date: 2022-06-17
slug: the-secret-ios-database-syncing-option-you-didnt-know-about-for-ipad-on-swift-playgrounds-amp-beyond
---
There is one thing you kind of got to have as an option when you’re making a utility app with generated data: to-dos, recipes, notes, etc.

You’ve got to let the person sync their data across all of their devices. iPhone, iPad, Mac; it has got to be everywhere.

So how do you do it?

If you’re thinking of going cross platform, you might go for AWS’s Amplify library, or of course, Firebase. (You can even still run [a thriving Parse database](https://github.com/parse-community/Parse-Swift)! [Even an easy third-party hosted one](https://www.back4app.com)!) 

However, those can cost money down the line. And if you’re happy to have an Apple-only app, CloudKit is a great way to go. Especially with relatively simple integration with CoreData. (And especially now that you can sell an app you’ve built with CloudKit, and transfer it to another account, something you couldn’t do before. I sold an app once that used CloudKit, and to get around things, I had to transfer the whole LLC! Thankfully, looks like those days are gone).

CloudKit+CoreData is what I used for [Pearl](https://apps.apple.com/us/app/pearl-wellness-reminders/id1567837432), but when I wanted to make data sync with [ToDon’t](https://apps.apple.com/us/app/todont/id1601697790), the app I made all on iPad’s Swift Playgrounds, I couldn’t use it! Rats!

I did notice, however, another permission allowed by Swift Playgrounds: Reminders.

That’s right, you can use the Reminders app as a dataset. You can make a reminder with a bunch of metadata, and decode that into your object. As long as your customer doesn’t mind having a custom list for your app in the Reminders app, you’re good to go. Oh, and it should be worth mentioning that you can only have 50,000 Reminders in that app. If you do have that many, I’m so sorry. Please consider a seaside vacation.

So, how does this work?

### The Basic App

Let’s start with our basic task list using CoreData. Here I give you, an entire CoreData task app! It’s not very fully featured. You just add items sorted alphabetically by name. But it’s a start!

  
  

```
`import CoreData
import SwiftUI

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(sortDescriptors: [
        NSSortDescriptor(keyPath: \TaskItem.name, ascending: true)
    ], animation: .default)
    private var items: FetchedResults<TaskItem>

    @State private var itemText = ""

    var body: some View {
        VStack {
            TextField("Add Note Here", text:$itemText) {
                let task = TaskItem(context: viewContext)
                task.name = itemText
                task.complete = false
                try? viewContext.save()
            }
            List(items) { item in
                VStack {
                    if !item.complete {
                        Text(item.name ?? "Unknown")
                    } else {
                        Text(item.name ?? "Unknown")
                            .strikethrough()
                        }
                }
                .onTapGesture {
                        viewContext.perform {
                            item.complete.toggle()
                            try! viewContext.save()
                        }
                    }
            }
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

@objc(TaskItem)
class TaskItem: NSManagedObject {
    @NSManaged var complete: Bool
    @NSManaged var name: String?
}

extension TaskItem: Identifiable {
    var id: NSManagedObjectID {
        self.objectID
    }
}

class Persistence {
    static let shared = Persistence()

    static let previewFull: Persistence = {
        let result = Persistence(inMemory: true)
        let context = result.container.viewContext
        for index in 0 ..< 5 {
            let task = TaskItem(context: context)
            task.name = "Task \(index + 1)"
            task.complete = false

            context.perform {
                try! context.save()
            }
        }
        return result
    }()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        let taskEntity = NSEntityDescription()
        taskEntity.name = "TaskItem"
        taskEntity.managedObjectClassName = "TaskItem"

        let nameAttribute = NSAttributeDescription()
        nameAttribute.name = "name"
        nameAttribute.type = .string
        taskEntity.properties.append(nameAttribute)

        let completeAttribute = NSAttributeDescription()
        completeAttribute.name = "complete"
        completeAttribute.type = .boolean
        taskEntity.properties.append(completeAttribute)

        let model = NSManagedObjectModel()
        model.entities = [taskEntity]

        let container = NSPersistentContainer(name: "TaskModel", managedObjectModel: model)

        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("failed with: \(error.localizedDescription)")
            }
        }

        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy

        container.viewContext.automaticallyMergesChangesFromParent = true
        self.container = container
    }
}

@main
struct QuickTaskAppApp: App {
    let persistence = Persistence.shared
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistence.container.viewContext)
        }
    }
}`
```

  
### Sync Strategy

Now, there are a lot of ways you can implement syncing.

My method is to let the user have two versions of their data. They have their device TaskItems, and they have the TaskItems that reflect what is in the Reminders app.

That way, they can flip a toggle and see the TaskItems that are only on the iPhone, or turn the toggle on and see the ones that are shared between all the devices.

We’ll add a property to TaskItem called reminderId. And we’ll make it optional. This will correspond to the shared id of the Reminder object. If a TaskItem has this, then we know that it has a twin in the Reminders app, and needs to be updated to reflect it when it is synced.

Now, we won’t get any fancy silent pushes to update ourselves like we would with CloudKit and CoreData. So we’ll want to sync to the latest when the app becomes active or comes to the foreground, along with a pull to refresh.

And when we edit our task items, we’ll want to create a version of the item in reminders too.

We won’t go into editing the individual items, but if we did, and we edited a TaskItem with a pair in the Reminders app, we would need to make sure to update that reminder too.

On to the code!

I add this to the Persistence initializer:

  
  

```
`let reminderIdAttribute = NSAttributeDescription()
                reminderIdAttribute.name = "reminderId"
                reminderIdAttribute.type = .string
                taskEntity.properties.append(reminderIdAttribute)`
```

  And we update TaskItem.

  
  

```
`@objc(TaskItem)
class TaskItem: NSManagedObject {
    @NSManaged var complete: Bool
    @NSManaged var name: String?
    @NSManaged var reminderId: String?
}`
```

  Now, I’m going to dump a rather large class called the ReminderManager. And I’ll mark it up with numbers to highlight certain parts.

  
  

```
`class ReminderManager {
    let store = EKEventStore()
    static let shared = ReminderManager()

    // 1
    static func predicate(isSynced: Bool) -> NSPredicate {
        if isSynced {
            return NSPredicate(format: "reminderId != nil")
        } else {
            return NSPredicate(format: "reminderId == nil")
        }
    }

    // 2
    func migrateExistingTasks(context: NSManagedObjectContext) {
        let fetchRequest = TaskItem.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "reminderId == nil")
        guard let tasks = try? context.fetch(fetchRequest) as? [TaskItem] else {
            return
        }

        for task in tasks {
            createReminder(item: task, context: context)
        }
    }

    // 3
    func syncCoreDataWithReminders(context: NSManagedObjectContext, isSynced: Bool) {
        guard isSynced else {
            return
        }

        let fetchRequest = TaskItem.fetchRequest()
        let taskPredicate = NSPredicate(format: "reminderId != nil", argumentArray: nil)
        fetchRequest.predicate = taskPredicate
        guard let tasks = try? context.fetch(fetchRequest) as? [TaskItem] else {
            return
        }

        var tasksThatAreRemindersDictionary: [String: TaskItem] = [:]

        for task in tasks {
            if let reminderId = task.reminderId {
                tasksThatAreRemindersDictionary[reminderId] = task
            }
        }

        do {
            let remindersList = try reminderCategory()
            let predicate: NSPredicate = store.predicateForReminders(in: [remindersList])
            store.fetchReminders(matching: predicate) { reminders in
                if let reminders = reminders {
                    for reminder in reminders {
                        if let existingTask = tasksThatAreRemindersDictionary[reminder.calendarItemExternalIdentifier] {
                            existingTask.complete = reminder.isCompleted
                            existingTask.name = reminder.title
                            tasksThatAreRemindersDictionary[reminder.calendarItemExternalIdentifier] = nil
                        } else {
                            let newTask = TaskItem(context: context)
                            newTask.complete = reminder.isCompleted
                            newTask.name = reminder.title
                            newTask.reminderId = reminder.calendarItemExternalIdentifier
                        }
                    }
                }
                // iterate through the leftover task and delete them.
                for task in tasksThatAreRemindersDictionary.values {
                    print("Deleting")
                    context.delete(task)
                }
            }
        } catch {
            print(error.localizedDescription)
        }

        do {
            try context.save()
        } catch {
            print(error.localizedDescription)
        }
    }

    // 4
    func saveReminderAfterEditingCoreData(tasks: [TaskItem], context: NSManagedObjectContext, delete: Bool = false, isSynced: Bool) {
        if isSynced {
            if delete {
                for task in tasks {
                    deleteTaskFromReminder(task: task)
                }
            } else {
                for task in tasks {
                    if let reminderId = task.reminderId, let reminder = store.calendarItems(withExternalIdentifier: reminderId).first as? EKReminder {
                        reminder.isCompleted = task.complete
                        reminder.title = task.name

                        do {
                            try store.save(reminder, commit: true)
                        } catch {
                            print("Failed to save reminder \(error.localizedDescription)")
                        }
                    } else {
                        createReminder(item: task, context: context)
                    }
                }
            }
        }

        do {
            try context.save()
        } catch {
            print(error.localizedDescription)
        }
    }

    // 5
    func createReminder(item: TaskItem, context: NSManagedObjectContext) {
        let reminder = EKReminder(eventStore: store)
        reminder.title = item.name
        reminder.isCompleted = item.complete
        do{
            reminder.calendar = try reminderCategory()
            try store.save(reminder, commit: true)
            item.reminderId = reminder.calendarItemExternalIdentifier
            try context.save()
            print(reminder, "saved")
        } catch {
            print("couldnt save: \(error.localizedDescription)")
        }
    }

    // 6
    func deleteTaskFromReminder(task: TaskItem) {
        if let reminderId = task.reminderId, let reminder = store.calendarItems(withExternalIdentifier: reminderId).first as? EKReminder {
            do {
                try store.remove(reminder, commit: true)
            } catch {
                print(error.localizedDescription)
            }
        }
    }

    // 7
    func requestReminderAccess() async -> Bool {
        do {
            let isAllowed = try await store.requestAccess(to: .reminder)
            return isAllowed
        } catch {
            print(error.localizedDescription)
            return false
        }
    }

    // 8
    func reminderCategory() throws -> EKCalendar {
        let calendars = store.calendars(for: .reminder)
        let calendarName = "QuickTaskApp"
        if let taskCalendar = calendars.first(where: {$0.title == calendarName}) { return taskCalendar }

        let calendar = EKCalendar(for: .reminder, eventStore: store)
        calendar.title = calendarName
        // NOTE! The defaultCalendarForNewReminders will be nil on simulator
        calendar.source = store.defaultCalendarForNewReminders()?.source
        try store.saveCalendar(calendar, commit: true)
        return calendar
    }
}`
```

  Here we go!

1. This is a little static function that returns a predicate. We’ll use this later to tell the list to only show TaskItems with a reminderId when the toggle for sync is on, and to only show TaskItems with a nil reminderId when the toggle for sync is off.

1. This is a little convenience bit for later if you want. If the user says, okay, I flipped the switch, but I want my existing tasks synced, you can create a button to press that will trigger this and it will make a copy of all the tasks and put them in the Reminders app.

1. This is what you would call to make sure your synced tasks are up to date with the Reminders app reminders, so maybe when the app appears, or during a pull to refresh. Notice that toward the end of the function, we even delete tasks if they don’t have a corresponding reminder. That’s because the user might’ve deleted them on a different device, and we need to reflect that.

1. This is what we would use to save a task after editing it, like marking it complete.

1. Pretty self-explanatory. We make the reminder!

1. This one too. We delete.

1. Ah, yes, you’ll need this one. And you’ll need to update your info.plist to include a privacy permission string.

1. This is where we grab our custom calendar inside the Reminders app. A calendar just means a list in our case. And if it doesn’t exist, we create it.

### Updating the View for Syncing

Awesome, I’ll add in the updated ContentView with more notes.

  
  

```
`struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext

    // 1
    @AppStorage("syncReminders") var isSynced = false

    // 2
    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \TaskItem.name, ascending: true)],
        predicate: ReminderManager.predicate(isSynced: UserDefaults.standard.bool(forKey: "syncReminders")),
        animation: .default)
    private var tasks: FetchedResults<TaskItem>

    @State private var itemText = ""

    var body: some View {
        VStack {
            Toggle("Show Synced", isOn: $isSynced)
            TextField("Add Note Here", text:$itemText) {
                let task = TaskItem(context: viewContext)
                task.name = itemText
                task.complete = false

                // 3
                ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, isSynced: isSynced)
            }
            List(tasks) { task in
                HStack {
                    VStack {
                        if !task.complete {
                            Text(task.name ?? "Unknown")
                        } else {
                            Text(task.name ?? "Unknown")
                                .strikethrough()
                            }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .contentShape(Rectangle())
                    .onTapGesture {
                            viewContext.perform {
                                task.complete.toggle()
                                ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, isSynced: isSynced)
                            }
                        }
                    Button {
                        // 4
                        viewContext.delete(task)
                        ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, delete: true, isSynced: isSynced)
                    } label: {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                    }

                }
            }
        } // 5
        .refreshable {
            ReminderManager.shared.syncCoreDataWithReminders(context: viewContext, isSynced: isSynced)
        }
        .padding()
        .task { // 6
            _ = await ReminderManager.shared.requestReminderAccess()
        }
        .onChange(of: isSynced) { newValue in
            if newValue {
                ReminderManager.shared.syncCoreDataWithReminders(context: viewContext, isSynced: newValue)
            }

            // 7
            tasks.nsPredicate = ReminderManager.predicate(isSynced: isSynced)
        }
    }
}`
```

  
1. Here we make our “syncReminders” boolean stored in UserDefaults easily accessible.

1. This looks a little odd. I would love to access the @AppStorage value inside of this predicate initialization, but you can’t do that unless you pass it in through an initializer. You get errors. So what I did instead, since I’m only working with one view right now, is to grab it directly from UserDefaults. You might think you could do this via onAppear and set the required predicate there, but there was a bit of transition flicker and animation when I did that. But overall, this is so that we remember how to filter our CoreData when the user leaves the app and comes back.

1. Here is where we create our task! You’ll notice that whenever I call saveReminderAfterEditingCoreData, I don’t save the viewContext after that line. That’s because I’m already saving with the viewContext inside that method. So we’re good.

1. Just for convenience of demo, I added a trash icon on the list. Otherwise, to get the more fancy slide over you need to add a ForEach and so on and I’m lazy. This is just so you can demo deleting.

1. Here is that refreshable! Now we can manually update our synced data.

1. Here is the reminder access request since it’s an async method, we put it in this task. This way you could take that returned value that I’m not doing anything with and show or hide the sync toggle and such.

1. And here is where we set the predicate depending on whether the toggle is enabled or not.

That’s pretty much it! Let’s see it in action!

  
  

  
### Odds and Ends and Troubleshooting

There are several things to keep in mind.

What if you want to save more metadata? Like a subtitle or a starred state, etc.

What I did was create a Codable struct of my metadata and then convert that to a json string and then save it in the .notes property of the reminder. That worked well!

What if you want to save an image or a video?

For an image, there is a way to attach images to reminders within the Reminders app, but I haven’t seen a way to access that in EventKit. Maybe there is, but I haven’t found it. If I wanted to attach an image though, I might get desperate and convert a reasonably compressed image into a string of bytes, save that to my metadata struct, and then recreate it when I want to display. It’s a long path, but hey, we’re hacking here.

As for a video, usually folks will say to store those as urls anyway, so you would probably want to create some authentication and save the video in S3 or Azure or Google Cloud blob storage, and then access it that way. It would, for iPad Playgrounds, require doing a lot of that authentication and video fetching from scratch.

A little warning: if the user hasn’t opened their Reminders ever, chances are you’ll be creating a local list, instead of an iCloud list. For troubleshooting, in the Reminders app you’ll see the local list under the “Local” heading.

Also, beware the simulator. The simulator doesn’t do syncing very well, with iCloud or anything else. I think it’s not getting the silent pushes in the Reminders app. So I had to restart the Reminders app and then I could get the updates each time. From the video, it works pretty well on the actual device.

And here you go! Here is the full code! Pasting the full code below. And if this was helpful and you want to support, download [ToDon’t](https://apps.apple.com/us/app/todont/id1601697790) and/or  [Pearl](https://apps.apple.com/us/app/pearl-wellness-reminders/id1567837432) and leave a nice review, or tip with an in-app purchase (ToDon’t is the cheaper one).

Thanks y’all!

  
  

```
`import CoreData
import EventKit
import SwiftUI

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext

    // 1
    @AppStorage("syncReminders") var isSynced = false

    // 2
    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \TaskItem.name, ascending: true)],
        predicate: ReminderManager.predicate(isSynced: UserDefaults.standard.bool(forKey: "syncReminders")),
        animation: .default)
    private var tasks: FetchedResults<TaskItem>

    @State private var itemText = ""

    var body: some View {
        VStack {
            Toggle("Show Synced", isOn: $isSynced)
            TextField("Add Note Here", text:$itemText) {
                let task = TaskItem(context: viewContext)
                task.name = itemText
                task.complete = false

                // 3
                ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, isSynced: isSynced)
            }
            List(tasks) { task in
                HStack {
                    VStack {
                        if !task.complete {
                            Text(task.name ?? "Unknown")
                        } else {
                            Text(task.name ?? "Unknown")
                                .strikethrough()
                            }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .contentShape(Rectangle())
                    .onTapGesture {
                            viewContext.perform {
                                task.complete.toggle()
                                ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, isSynced: isSynced)
                            }
                        }
                    Button {
                        // 4
                        viewContext.delete(task)
                        ReminderManager.shared.saveReminderAfterEditingCoreData(tasks: [task], context: viewContext, delete: true, isSynced: isSynced)
                    } label: {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                    }

                }
            }
        } // 5
        .refreshable {
            ReminderManager.shared.syncCoreDataWithReminders(context: viewContext, isSynced: isSynced)
        }
        .padding()
        .task { // 6
            _ = await ReminderManager.shared.requestReminderAccess()
        }
        .onChange(of: isSynced) { newValue in
            if newValue {
                ReminderManager.shared.syncCoreDataWithReminders(context: viewContext, isSynced: newValue)
            }

            // 7
            tasks.nsPredicate = ReminderManager.predicate(isSynced: isSynced)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

@objc(TaskItem)
class TaskItem: NSManagedObject {
    @NSManaged var complete: Bool
    @NSManaged var name: String?
    @NSManaged var reminderId: String?
}

extension TaskItem: Identifiable {
    var id: NSManagedObjectID {
        self.objectID
    }
}

class Persistence {
    static let shared = Persistence()

    static let previewFull: Persistence = {
        let result = Persistence(inMemory: true)
        let context = result.container.viewContext
        for index in 0 ..< 5 {
            let task = TaskItem(context: context)
            task.name = "Task \(index + 1)"
            task.complete = false

            context.perform {
                try! context.save()
            }
        }
        return result
    }()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        let taskEntity = NSEntityDescription()
        taskEntity.name = "TaskItem"
        taskEntity.managedObjectClassName = "TaskItem"

        let nameAttribute = NSAttributeDescription()
        nameAttribute.name = "name"
        nameAttribute.type = .string
        taskEntity.properties.append(nameAttribute)

        let completeAttribute = NSAttributeDescription()
        completeAttribute.name = "complete"
        completeAttribute.type = .boolean
        taskEntity.properties.append(completeAttribute)

        let reminderIdAttribute = NSAttributeDescription()
                reminderIdAttribute.name = "reminderId"
                reminderIdAttribute.type = .string
                taskEntity.properties.append(reminderIdAttribute)

        let model = NSManagedObjectModel()
        model.entities = [taskEntity]

        let container = NSPersistentContainer(name: "TaskModel", managedObjectModel: model)

        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("failed with: \(error.localizedDescription)")
            }
        }

        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy

        container.viewContext.automaticallyMergesChangesFromParent = true
        self.container = container
    }
}

@main
struct QuickTaskAppApp: App {
    let persistence = Persistence.shared
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistence.container.viewContext)
        }
    }
}

class ReminderManager {
    let store = EKEventStore()
    static let shared = ReminderManager()

    // 1
    static func predicate(isSynced: Bool) -> NSPredicate {
        if isSynced {
            return NSPredicate(format: "reminderId != nil")
        } else {
            return NSPredicate(format: "reminderId == nil")
        }
    }

    // 2
    func migrateExistingTasks(context: NSManagedObjectContext) {
        let fetchRequest = TaskItem.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "reminderId == nil")
        guard let tasks = try? context.fetch(fetchRequest) as? [TaskItem] else {
            return
        }

        for task in tasks {
            createReminder(item: task, context: context)
        }
    }

    // 3
    func syncCoreDataWithReminders(context: NSManagedObjectContext, isSynced: Bool) {
        guard isSynced else {
            return
        }

        let fetchRequest = TaskItem.fetchRequest()
        let taskPredicate = NSPredicate(format: "reminderId != nil", argumentArray: nil)
        fetchRequest.predicate = taskPredicate
        guard let tasks = try? context.fetch(fetchRequest) as? [TaskItem] else {
            return
        }

        var tasksThatAreRemindersDictionary: [String: TaskItem] = [:]

        for task in tasks {
            if let reminderId = task.reminderId {
                tasksThatAreRemindersDictionary[reminderId] = task
            }
        }

        do {
            let remindersList = try reminderCategory()
            let predicate: NSPredicate = store.predicateForReminders(in: [remindersList])
            store.fetchReminders(matching: predicate) { reminders in
                if let reminders = reminders {
                    for reminder in reminders {
                        if let existingTask = tasksThatAreRemindersDictionary[reminder.calendarItemExternalIdentifier] {
                            existingTask.complete = reminder.isCompleted
                            existingTask.name = reminder.title
                            tasksThatAreRemindersDictionary[reminder.calendarItemExternalIdentifier] = nil
                        } else {
                            let newTask = TaskItem(context: context)
                            newTask.complete = reminder.isCompleted
                            newTask.name = reminder.title
                            newTask.reminderId = reminder.calendarItemExternalIdentifier
                        }
                    }
                }
                // iterate through the leftover task and delete them.
                for task in tasksThatAreRemindersDictionary.values {
                    print("Deleting")
                    context.delete(task)
                }
            }
        } catch {
            print(error.localizedDescription)
        }

        do {
            try context.save()
        } catch {
            print(error.localizedDescription)
        }
    }

    // 4
    func saveReminderAfterEditingCoreData(tasks: [TaskItem], context: NSManagedObjectContext, delete: Bool = false, isSynced: Bool) {
        if isSynced {
            if delete {
                for task in tasks {
                    deleteTaskFromReminder(task: task)
                }
            } else {
                for task in tasks {
                    if let reminderId = task.reminderId, let reminder = store.calendarItems(withExternalIdentifier: reminderId).first as? EKReminder {
                        reminder.isCompleted = task.complete
                        reminder.title = task.name

                        do {
                            try store.save(reminder, commit: true)
                        } catch {
                            print("Failed to save reminder \(error.localizedDescription)")
                        }
                    } else {
                        createReminder(item: task, context: context)
                    }
                }
            }
        }

        do {
            try context.save()
        } catch {
            print(error.localizedDescription)
        }
    }

    // 5
    func createReminder(item: TaskItem, context: NSManagedObjectContext) {
        let reminder = EKReminder(eventStore: store)
        reminder.title = item.name
        reminder.isCompleted = item.complete
        do{
            reminder.calendar = try reminderCategory()
            try store.save(reminder, commit: true)
            item.reminderId = reminder.calendarItemExternalIdentifier
            try context.save()
            print(reminder, "saved")
        } catch {
            print("couldnt save: \(error.localizedDescription)")
        }
    }

    // 6
    func deleteTaskFromReminder(task: TaskItem) {
        if let reminderId = task.reminderId, let reminder = store.calendarItems(withExternalIdentifier: reminderId).first as? EKReminder {
            do {
                try store.remove(reminder, commit: true)
            } catch {
                print(error.localizedDescription)
            }
        }
    }

    // 7
    func requestReminderAccess() async -> Bool {
        do {
            let isAllowed = try await store.requestAccess(to: .reminder)
            return isAllowed
        } catch {
            print(error.localizedDescription)
            return false
        }
    }

    // 8
    func reminderCategory() throws -> EKCalendar {
        let calendars = store.calendars(for: .reminder)
        let calendarName = "QuickTaskApp"
        if let taskCalendar = calendars.first(where: {$0.title == calendarName}) { return taskCalendar }

        let calendar = EKCalendar(for: .reminder, eventStore: store)
        calendar.title = calendarName
        // NOTE! The defaultCalendarForNewReminders will be nil on simulator
        calendar.source = store.defaultCalendarForNewReminders()?.source
        try store.saveCalendar(calendar, commit: true)
        return calendar
    }
}`
```