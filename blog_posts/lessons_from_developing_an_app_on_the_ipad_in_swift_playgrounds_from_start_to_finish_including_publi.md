---
title: "Lessons from Developing an App on the iPad in Swift Playgrounds from Start to Finish (Including Publishing on the App Store)"
date: 2022-01-05
slug: lessons_from_developing_an_app_on_the_ipad_in_swift_playgrounds_from_start_to_finish_including_publi
---

I didn’t know entirely what I was getting myself into by making an app on the iPad. 

I went in aware of its limitations and tried to think of a little something I could make for myself that would be useful and extremely simple.

Thus I settled on the love song of so many developers, the thing that there is plenty of in the world, and yet which is close enough to our souls that we always find ways to make it our own.

I mean, of course, the to-do app.

I’m an odd bird, so I thought it would be fun to load a to-do app with lots of random and silly things to NOT do, so that I could have a giggle, and check it off for that tiny dopamine hit.

[And thus my to-do app ToDon’t was born](https://apps.apple.com/us/app/todont/id1601697790).

I have a large set of code and videos of actually making the app here: https://twitter.com/wattmaller1/status/1472263788233641988?s=20

As a whole though, let’s start with the limitations:

## Limited …

1. **In-app purchases (not what you think!)**: Early reports mistakenly thought it wasn’t possible to use in-app purchases with Swift Playgrounds. What I found out was that they in fact work, but they only become testable in TestFlight, which is annoying since we just got such amazing support of testing configurations and such in Xcode. What you need to do instead, if you want to test in-app purchase scenarios multiple times, is to logout of iCloud on your device and login with a sandbox test account. This is because TestFlight won’t use the sandbox account that you can use in the App Store settings area of your device. It’ll use the iCloud account your device is logged in with overall. (Feedback Id: FB9830444)

1. **CloudKit: **CloudKit is one of those really nice ways to get scalable, first-party, out-of-the-box syncing and such right in your app. [It’s what my app Pearl uses](https://apps.apple.com/us/app/pearl-wellness-reminders/id1567837432). And dang, I really wish I could’ve used it in ToDont. There is, however, Swift Package support, so if you find persistent storage with some drop-in syncing, that should probably do the trick for you. Probably will have the friction of needing to sign the user into something, and create an account. Dang it, I miss CloudKit. (Feedback Id: FB9830450)

1. **No Built-In Git**: I needed to install a separate app to drag in my playground file and upload it to GitHub from my iPad. Built-in source control would be an excellent addition to Swift Playgrounds as an educational feature as well! (Feedback Id: FB9830486)

1. **Limited Debugging**: Very limited, in fact. You get print statements and that’s about it. No stepping through code. (Feedback Id: FB9830492)

1. **No direct to iPhone**: This is something I was missing. I could only test on the iPhone after I uploaded to TestFlight, so it took a good while to smooth out some animation bugs that appeared only on an older iPhone and not on the iPad. (Feedback Id: FB9830494)

1. **Widgets & extensions**: No widget support is a bummer, along with other extensions, like keyboard extensions, and so forth. (Feedback Id: FB9830498)

1. **Miscellaneous**: There are a bunch of things here and there that folks have mentioned: you can import images but can’t clarify sizes with an asset catalogue (Feedback Id: FB9830500), you can’t edit json files from Playgrounds (I guess it’s called SWIFT Playgrounds, eh?). Reading them and parsing them is fine, they’ll just be under “Resources”. However, it would be great to edit these files even if it’s only as basic text files (Feedback Id: FB9830502). There aren’t device previews within Playgrounds previews the way there are for Xcode (Feedback Id: FB9830505). 

A few more things: it would be nice for the validation of the length of the app name to happen before submitting to App Store Connect (Feedback Id: FB9830509). I haven’t found a way to jump to the definition of a class, struct, etc. Been missing that (Feedback Id: FB9830513). Also refactoring, like renaming all references (Feedback Id: FB9830510). And being able to search an individual file would be good.

Also, it would be nice if we could specify [*ITSAppUsesNonExemptEncryption*](https://developer.apple.com/documentation/bundleresources/information_property_list/itsappusesnonexemptencryption)* *for smooth uploading to TestFlight, so that I don’t need to update the security settings every time on the web. [Although that might be in the works](https://www.rambo.codes/posts/2021-12-28-a-document-based-app-in-swift-playgrounds-for-ipad). (Feedback Id: FB9830517)

Also, as a heads up, you’ll need to make sure you don’t have references to developing on iPad in your metadata. Specifically, I got rejected for my iPad App Store screenshots including the little orange Swift logo in the corner since I took a screenshot while Playgrounds was running.

## … And Yet Delightful

1. **Fast previews**: We’re running right on the hardware. Previews happen very quickly.

1. **Nice code completion**: Not everyone reported success with this, and indeed, for myself, code completion stopped a couple of times, and it came back when I restarted the app and hasn’t gone away since. And the code completion I’ve gotten is very fast even with massive files, so no complaints from me there.

1. **Versatile**: I mean, I’ve got Core Data going, I can build AR apps, games, all of the standard things you want from apps that are essentially smooth web portals are here, we’ve got Bluetooth, microphones, speech recognition, core motion, and of course the camera. It’s all there!

1. **Perfect prototyper**: If you want to do some work on UI especially, and do a bunch of prototyping, this is a wonderful tool. It’s my go-to code machine around the house lately. Obviously because of ToDon’t, but I find myself thinking, could I just use the iPad? Because Playgrounds are just so light and responsive. Combined with my little magnetic Magic Keyboard, this little thing is a fun, no distractions machine.

1. **Ease of publishing**: I named my app, gave it it an identifier, and it just uploaded. I can’t tell you how much of a headache it was to get an app I worked on to the App Store. Provisioning profiles, amiright? Uploading the app is just, really nice. And you can create the app record from Playgrounds as well! It makes it all for you.

1. **A gateway**: I remember working on my iMac and just getting absolutely hooked on how cool it was to create an app when I first started 9 years ago. And to get it running on my phone especially! (I really want that ease of getting apps on the phone). It’s all so much fun. And the fact that it can now be done on a relatively inexpensive machine in a high-quality way is also just great.

## Conclusion

In the end, this is exactly what it says it is: Swift Playgrounds. It’s a playground! It’s a place that is primarily great to figure things out. It’s certainly not Xcode on the iPad, nor is it a brand new App Composer app or anything like that. It will shine mostly as a great educational and prototyping tool. 

And heck, it’s pretty great as a sideproject engine so far. I say that because there is a sweet spot where constraints enable creativity, like the limitations of a sonnet. I’ll be interested to see if any masterpieces emerge.