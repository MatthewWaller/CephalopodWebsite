---
title: Making a PDF Capture App Part 6: The OCR Endgame
date: 2021-05-15
slug: making-a-pdf-capture-app-part-6-endgame
---
Here it is, the final feature. We’ve already overcome in the native competition with our adding and removal of pages and making the process of capturing a PDF more efficient. Next we add OCR, or optical character recognition, to make our app even more worthwhile for customers, and to add a certain flair and fun.

OCR basically means we recognize text inside the PDF image. Now people won’t only have a digital version of their document; they can do whatever they want with the text!

This means our new app not only implements augmented reality (digitally perceiving and overlaying the real world through the scanner, in our case), but it also gets to implement top-of-the-line AI/ML. AND I would like to point out that all of this advanced processing is happening on the device. No Internet needed, no services, no accounts, no API. Just getting down to business with cutting-edge, privacy-focused technology. Pretty hot stuff.

Let’s get to it.

Here, first of all, is our text recognition code to extract text from an image:

```
`import Foundation
import PDFKit
import Vision
import VisionKit

class TextRecognizer {
    struct TextRecognitionValue {
        let pageIndex: Int
        let rect: CGRect
        let string: String
    }

    func recognizeText(inImage image: UIImage,
                       atIndex index: Int,
                       withProgressHandler progressHandler: @escaping (Double, Int) -> Void,
                       withCompletionHandler completionHandler: @escaping ([TextRecognitionValue]) -> Void) {
        // 1
        let request = VNRecognizeTextRequest { request, error in
            // 2
            if let observatons = request.results as? [VNRecognizedTextObservation] {
            // 3
                let values: [TextRecognitionValue] = observatons.compactMap {
                    // 4
                    if let topCandidate = $0.topCandidates(1).first, topCandidate.confidence > 0.35 {
                        // 5
                        if let rect = try? topCandidate.boundingBox(for: topCandidate.string.startIndex..<topCandidate.string.endIndex) {
                            return TextRecognitionValue(pageIndex: index, rect: rect.boundingBox, string: topCandidate.string)
                        }
                    }
                    return nil
                }

                DispatchQueue.main.async {
                    completionHandler(values)
                }
            }
        }

        // 6
        request.recognitionLanguages = ["en_US"]

        // 7
        request.progressHandler = { _, progress, _ in
            progressHandler(progress, index)
        }

        guard let imageToUse = image.cgImage else {
            completionHandler([])
            return
        }

        // 8
        let handler = VNImageRequestHandler(cgImage: imageToUse, options: [:])
        do {
            try handler.perform([request])
        } catch {
            // TODO: Handle error
        }
    }
}`
```

  So going through the numbered comments:

1. First we make our request, which comes with a completion handler.

1. Inside the handler we unwrap the result to see if we got any observations

1. If we got observations we convert them into values, which are the TextRecognitionValue structs we defined as part of this class. These struct keep track of the PDF page of each value, the string, and the bounding box.

1. So next we take the top candidate, or best guess, and make sure it has a reasonable confidence level. This will keep us from trying to read things like signatures, but you may also want to let the user know it could limit the text it can get from PDFs, if they’re poor quality documents or pictures of documents.

1. And finally, we get the bounding box for the whole string o the top candidate

1. After that we set the language we’re looking for.

1. Then we create a progress handler that’ll let us tell the user how far along this operation is going.

1. After making sure we have the image in the format we need, we create a handler that performs the request and we’re off.

That was it!

Now, when we create our progress view, you might be tempted to add yet another @Published variable to our PDFManager. I would recommend against this. Better to create a separate view model for our new property. This way, we don’t update all of the other views that are dependent on the PDFManager.

So we make this:

```
`import SwiftUI

class TextRecognitionProgressReporter: ObservableObject {
    @Published var progress: Double = 0
}`
```

  And with that we can make our progress view.

```
`import SwiftUI

struct TextRecognitionProgressView: View {
    @ObservedObject var reporter: TextRecognitionProgressReporter
    var body: some View {
        VStack {
            Text("Recognizing Text")
            ProgressView(value: reporter.progress)
        }
        .padding()
    }
}

struct TextRecognitionProgressView_Previews: PreviewProvider {
    static var previews: some View {
        TextRecognitionProgressView(reporter: TextRecognitionProgressReporter())
    }
}`
```

  It’s pretty plain, but it will do for this skeleton of an app.

Now to modify the PDFManager, where heavy lifting is done.

We’ll add some properties to PDFManager

```
`var pageCount: Int {
    document?.pdf.pageCount ?? 0
}

var textRecognitionProgressReporter = TextRecognitionProgressReporter()
private var completionTracker: Int = 0
private var textRecognizer = TextRecognizer()`
```

  We’ll also update our PDFTrapperNavigation enum from last time to have a new category: .recognizingText

So far so good, but one thing we’re going to want to do is, if we’ve already scanned and captured our PDF, we’ll want to turn the PDF back into an image for the recognizer. So let’s add this method to PDFManager:

```
`private func getImage(fromPage page: PDFPage) -> UIImage? {
        let pageRect = page.bounds(for: .mediaBox)

        let renderer = UIGraphicsImageRenderer(size: pageRect.size)

        let image = renderer.jpegData(withCompressionQuality: 1.0, actions: { context in
            UIColor.white.set()
            context.fill(pageRect)
            context.cgContext.translateBy(x: 0.0, y: pageRect.size.height);
            context.cgContext.scaleBy(x: 1.0, y: -1.0);
            page.draw(with: .mediaBox, to: context.cgContext)
        })

        return UIImage(data: image)
    }`
```

  This gives us a nice high quality image to extract the most text we can.

Next, let’s add a method that will take the values and add them to the PDF:

```
`private func addTextToPDF(values: [TextRecognizer.TextRecognitionValue]) {
        // TODO
    }`
```

  And now let’s use that method in another method that will fire when our text recognition is done:

```
`private func textCompletionHandler(_ values: [TextRecognizer.TextRecognitionValue]) {
        DispatchQueue.main.async {
            [weak self] in
                guard let self = self else {
                    return
                }

                self.addTextToPDF(values: values)

                self.completionTracker -= 1
                if self.completionTracker == 0 {
                    self.save()
                }
        }
    }`
```

  As you can see, each time we get an array of values we’ve finished a page, and so each time we subtract until we get to zero, and we know that our pages are done.

This wouldn’t be very good form if the user was doing things like, recognizing multiple PDFs at once. Then you would want a queue system and such. But since we’re working with one PDF at a time, we should be good to go.

We’ll also want to create our progress handler, to take care of showing where we’re at in the recognition.

```
`private func progressHandler(_ progress: Double, index: Int) {
        DispatchQueue.main.async {[weak self] in
            guard let self = self else {
                return
            }

            self.textRecognitionProgressReporter.progress = (progress + Double(index) / Double(self.pageCount))

        }
    }`
```

  And with that, we can create our new method to get the text!

```
`func getText() {
        // Show progress screen
        guard let pdf = document?.pdf else {
            // Show error message
            return
        }

        guard pdf.pageCount > 0 else {
            // Show error message
            return
        }

        completionTracker = pageCount
        textRecognitionProgressReporter.progress = 0
        navigation = .recognizingText
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            for pageIndex in 0 ..< pdf.pageCount {
                if let page = pdf.page(at: pageIndex),
                   let image = self.getImage(fromPage: page) {
                    self.textRecognizer.recognizeText(inImage: image,
                                                 atIndex: pageIndex,
                                                 withProgressHandler: self.progressHandler,
                                                 withCompletionHandler: self.textCompletionHandler)
                }
            }
        }
    }`
```

  To fire off this new method we’ve created I’m going to add a button to our controls and put it in its own view.

```
`import SwiftUI

struct PDFMainControls: View {
    @ObservedObject var manager = PDFManager()
    var body: some View {
        HStack {
            Button("Get Text") {
                manager.getText()
            }
            Button("Editing Canvas") {
                withAnimation {
                    manager.navigation = .showEditor
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    manager.startEditMode.send()
                }
            }
            Button("Add/Remove Pages") {
                withAnimation {
                    manager.navigation = .showAddRemovePages
                }
            }
        }
    }
}`
```

  With that, we can put together our main ContentView, which now looks like this:

```
`import Combine
import PDFKit
import SwiftUI

struct ContentView: View {
    @StateObject var manager = PDFManager()
    @Binding var document: PDFTrapperDocument
    var fileURL: URL?

    private func save() {
        document.setAsNotBlank()
        document.saveTrigger.toggle()

       refresh()
    }

    private func refresh() {
        withAnimation {
            manager.navigation = .refreshing
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation {
                manager.navigation = .showPDFMain
            }
        }
    }

    var body: some View {
        ZStack {
            PhotoLibraryController(presenter: manager.photoPickerPresenter,
                                   reporter: manager.photoPickerReporter)
                .opacity(0)
            FilePickerController(presenter: manager.filePickerPresenter,
                                 reporter: manager.filePickerReporter)
                .opacity(0)
            if let url = fileURL {
                QuickLookController(startEditing: manager.startEditMode, url: url) {
                    if let refreshedPDF = PDFDocument(url: url) {
                        document.pdf = refreshedPDF
                        save()
                    }
                }
                .opacity(0)
            }
            switch manager.navigation {
            case .showPDFMain:
                if !document.isBlank {
                    VStack {
                        PDFDisplayView(pdf: document.pdf)
                        PDFMainControls(manager: manager)
                    }
                }                
            case .showScanner:
                ScannerView { images in
                    manager.addPhotos(images)
                }
            case .showAddRemovePages:
                AddRemovePagesView(pageCount: manager.pageCount, manager: manager)
            case .recognizingText:
                TextRecognitionProgressView(reporter: manager.textRecognitionProgressReporter)
            case .refreshing, .showEditor:
                ProgressView()
            }
        }
        .onAppear {
            manager.document = document
            if document.isBlank {
                withAnimation {
                    manager.navigation = .showScanner
                }
            }
        }
        .onReceive(manager.saveReporter, perform: save)
    }
}`
```

  
## Adding the text

Alright, that was a lot of putting things together. And right now we will in fact be able to get text from our document!

But how do we show it? What do we do with it? We have the entire addTextToPDF method to fill out.

Let’s add a simple annotation to hold our text.

```
`private func addTextToPDF(values: [TextRecognizer.TextRecognitionValue]) {
        guard let index = values.first?.pageIndex,
              let page = document?.pdf.page(at: index) else {
            return
        }

        let completeTextArray = values.map {
            $0.string
        }

        let completeText = completeTextArray.joined(separator: "\n\n")

        let annotation = PDFAnnotation(bounds: CGRect(origin: .zero, size: CGSize(width: 200, height: 200)), forType: .text, withProperties: nil)
        annotation.iconType = .note
        annotation.contents = completeText
        annotation.font = UIFont.systemFont(ofSize: 15)
        annotation.fontColor = .black
        annotation.color = .yellow

        page.addAnnotation(annotation)
    }`
```

  And here are the fruits of our labor!

Our app captures a PDF from a scan and recognizes even cursive handwriting.

  
## Next Level OCR - A Terrible Tease

Okay, so we have the text. But we also have binding boxes. We know where the text goes on the page! So I took the next step and actually wrote the words on the page in clear color so that the text can be directly selected, copied, pasted and searched for on the page!

This however, is where the journey ends. For those who want extra credit though, and want to do what I did, I’ll give some hints:

```
`pageBox = page.bounds(for: .mediaBox)
            let renderer = UIGraphicsPDFRenderer(bounds: pageBox, format: format)
            let pageData = renderer.pdfData { [weak self] context in
                guard let self = self else { return }
                self.drawTextInPDF(withContext: context,
                                   pageBox: pageBox,
                                   page: page,
                                   values: values)
..........

private func drawTextInPDF(withContext context: UIGraphicsPDFRendererContext,
                               pageBox: CGRect,
                               page: PDFPage,
                               values: [TextRecognizer.TextRecognitionValue]) {
        let widthMultiplier = pageBox.width
        let heightMultiplier = pageBox.height
        context.beginPage()

        let flipVertical: CGAffineTransform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: 0, ty: pageBox.size.height)
        context.cgContext.concatenate(flipVertical)

        page.draw(with: .mediaBox, to: context.cgContext)

        context.cgContext.concatenate(flipVertical)

............

let boundingBox = value.string.boundingRect(with: constraintRect,
                                                        options: [.usesLineFragmentOrigin, .usesFontLeading],
                                                        context: nil)`
```

  Okay, okay, I’lll stop being cryptic. As a general overview, use UIGraphicsPDFRenderer to create a page draw the text with the cgContext. And scale the text into the shape of the bounding box. Which is normalized, BTW, so you’ll want to get the dimensions according to the size of the PDF.

And with all of that, you can get something as awesome as this:

PDF OCR done with drawing the text inline.

  With that, our app’s core functionality is complete. Tune in next time for the epilogue, where we will go over all we have completed and what it will take to actually bring this app to market! Until next time, happy coding.