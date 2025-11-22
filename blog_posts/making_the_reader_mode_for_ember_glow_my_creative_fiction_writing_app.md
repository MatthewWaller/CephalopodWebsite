---
title: "Making the Reader Mode for Ember Glow, my creative fiction writing app"
date: 2024-09-16
slug: making_the_reader_mode_for_ember_glow_my_creative_fiction_writing_app
---

Good writing requires good reading. 

I recently [launched Ember Glow](https://apps.apple.com/us/app/writing-app-ember-glow/id6584513293). I wrote a bit about the app overall [here](https://www.cephalopod.studio/blog/announcing-the-launch-of-ember-glow-a-creative-fiction-writing-app), but there was one challenge that was a bit tricky to solve.

I was making this app for both iPhone and iPad. iPad, because it’s a great space for writing. And I made a mode where you can remove distractions and write and it’s very nice.

The iPhone, however, isn’t the best place to write a novel. But it’s a pretty great place to read one if you do it right. The obvious thing to do is to turn the user’s writing into an ePub format and then display it. Well, there are resources for parsing the ePub format, even in Swift, but not so much for converting text into ePub format.

For now then, in order to meet the RevenueCat Ship-a-ton deadline, I went ahead and made my own little reader.

The easiest thing to do would be to put the whole book in a single ScrollView. There is a reason, however, we read more in books with pages than scrolls. Even the e-readers. So, I wanted pagination. Well, I could use the PageView style on a TabView and voila!

This, unfortunately, is trickier than it sounds. First, you have to figure out how much text goes on each page. And you want to start a new page when there is a new chapter. And I’m using NSAttributeString, so that the user can make their own font colors, weight, size and so on.

After going back and forth and a ton of testing, I did it. I made my reader, and I’m sharing it with you now.

[Here is the open source repo](https://github.com/MatthewWaller/ReaderViewExample/tree/main).

The main thing doing the heavy lifting is [CTFramesetterCreateWithAttributedString](https://developer.apple.com/documentation/coretext/1478568-ctframesettercreatewithattribute). A gotcha I found is that you really want your attributed string to also have weight attributes and the whole bit, and that the safest thing to do, for accessibility and user preference, is to use the UIFont.preferredFont method to get the font just right. There are examples of that in the makeChapter static methods in the project.

To use that, you need to get the size of the view, which can change depending on the user’s device, or iPad things like changing view sizes in split view and such. So we have a SizeReaderLayout read the size using the recent Layout protocol, an improvement, in my estimation, on trying to read it with GeometryReader. With that, we can make our number of pages responsive to the size of the screen.

From there it’s just careful logic of keeping your place and passing on the last character of one NSRange to the next.

I also show how you can keep track of the user’s place between app launches, as well as how to jump to chapters. I hope you like it!