---
title: Seeing your Mac in 3rd Party Immersive apps on the Vision Pro
date: 2024-09-21
slug: seeing-your-mac-in-3rd-party-immersive-apps-on-the-vision-pro
---
A top use of the Vision Pro is to get in the zone and focus on work. It’s for those moments when you have a solid hour or two of uninterrupted time, so you throw on your headphones and hunker down. Those are the times when I put on the Vision Pro, fire up a nice environment and dive into work.

However, there are only so many environments that Apple has created that work with the Mac Virtual Display, which is the way to get work done that doesn’t involve a web app. So all my Python coding, all my machine learning work and data processing in the day-to-day job, that needs to happen on my Mac (and on Remote Desktop setups on my Mac, for Linux and Windows work).

And even if you use Safari, you basically just have Apple’s first-party environments. Which are wildly nice, have day and night modes, and are just spectacular, to be sure. But what if you want something different? What if you want to bring your Mac desktop into VR chat? Or an environment that is available through [our app Passage](https://apps.apple.com/us/app/flowriter-writers-retreat/id6470159510)? Or a custom environment that you can generate through our app Passage? (Let the record show, I am a fan of our app Passage).

Well, in Passage we do have a mini web browser that works for most web apps, but it’s bringing in the full desktop environment that makes things shine.

And now with visionOS 2.0 released, here’s how you can do it. Full disclosure, it’s really involved if you’re not already a developer in Apple’s ecosystem, but it’s so, so worth it.

#### Enabling Mac Virtual Display in Immersive Environments

First thing to note is that you don’t need the specialized developer strap to hook your Vision Pro to the developer program called [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12). You can connect to it over wifi, easy peasy. After you’ve downloaded Xcode, you can follow these steps (and most of the steps are nicely laid out [here](https://www.reddit.com/r/VisionPro/comments/1al399n/cant_find_developer_mode_in_privacy/), so I want to give credit.):

1. Put the Vision Pro and your Mac on the same Wi-Fi network.

1. After you go to Settings > General > Remote Devices, you’ll see it says “No devices available”.

1. On your Mac, open Xcode.

1. Also on the Mac, go to Devices and Simulators > Devices > and click the + button to add a new device.

1. Next Vision Pro should appear in Xcode as an available device, or Mac should appear as a remote device in Vision Pro. Then click to add the available device.

1. On the Mac, it will ask you to connect the device via USB, and the "Next" button will greyed out. Close this window, and now in the Devices list the Vision Pro will appear.

1. On the Mac, click on the Vision Pro in the Devices list and click "Pair".

1. Get the confirmation code that appears on the Vision Pro

1. Enter the confirmation code on the Mac

1. On the Vision Pro, go to Settings > Privacy & Security, scroll down to developer mode and enable it.

1. Restart the Vision Pro, and after restart, when it asks if you want developer mode on, say yes.

1. Finally, you’ll have a new section at the bottom of Vision Pro’s settings called Developer. Go there and turn on the switch for “Allow Mac Virtual Display”.

#### Have fun!

All you have to do now is go into an immersive experience, and your Mac Virtual Display will come with you! You can go into any Passage environment and have it with you. You could go into the Disney+ app theater modes and work at the top of Stark Tower. You could open the Max streaming app and code in the Iron Throne room. Or anywhere in VR chat.

Some tips:

- For environments that are full immersive, like Disney’s and Max’s, you won’t be able to see the keyboard, so you’ll want to use the crown to tone down the immersion until you can see your keyboard well enough. I still get to see plenty of my surroundings even with the immersion not fully on. Sadly, Apple doesn’t let 3rd party full immersion allow for the keyboard to display automatically like it does in the system environments.

- Optionally, in Passage, you can change the immersion mode in settings to enable the keyboard/desk cutout, which is re-positionable, resizable, and rotatable.

Enjoy!