---
title: "On Creating an On-Device Stable Diffusion App, &amp; Deciding Not to Release It: Adventures in AI Ethics"
date: 2022-11-03
slug: on_creating_an_on_device_stable_diffusion_app_amp_deciding_not_to_release_it_adventures_in_ai_ethics
---

The app was approved in the App Store. It had gotten through app review. I had more than 900 beta testers in the public beta. So many [retweets](https://twitter.com/wattmaller1/status/1581284065197445122?s=20&t=ogx50n3wIVNk6o0dZJlFsw) and [likes of my snippets of my work ](https://twitter.com/wattmaller1/status/1573768941096374274?s=20&t=ogx50n3wIVNk6o0dZJlFsw)throughout the development process. This was going to be my biggest side-project app, and I’ve already made apps on the side that generated enough for a 20-hour-a-week job, which I then sold off for work-life balance. This one though, I had the dollar signs in my eyes.

The reason it was interesting was because I figured out how to do a powerful image generation technique - previously only accessible via a cloud server or a beefy laptop - all on a phone. This opened up the chance for me to drastically out-price competitors relying on expensive cloud servers and have much more control over the experience.

And I had accomplished amazing technical marvels. My first image took an hour on a 4-year-old iPhone. I later got it does to 15 minutes on that phone. And down to 2 minutes on a new phone! (Sidenote, this was because I figured out how to get the model running on the Apple Neural Engine, a thing I previously thought was all marketing speak for internals that only matter to our internal camera team and what not. Let me tell you: getting that thing running on there was just doubled my speed and memory efficiency. [Here is one helpful link](https://machinelearning.apple.com/research/neural-engine-transformers).)

Then at another person’s behest, I started looking at ways I could support the artists whose work had been used to train the model originally, since I wasn’t the original trainer or purveyor of the dataset. I went down that path, and I’ve come out the other side saying, no, this version of my app, which uses [Stable DIffusion](https://huggingface.co/spaces/stabilityai/stable-diffusion) as trained on the [LAION-5B](https://laion.ai/blog/laion-5b/) dataset (the 5B meaning more than 5 billion and scraped from the Internet and not curated), should not be released. Dang it.

## Part One: License

I did do a bit of research at the outset as to whether it was legal to use the stable diffusion in an app. I looked at the [license](https://huggingface.co/spaces/CompVis/stable-diffusion-license) and determined, yeah, that’s pretty dang broad and the main portion is that you have the user agree to terms of use, which amounts to: don’t do bad stuff with this.

Besides, I had already seen a dozen projects on Twitter showing off this and that use of Stable Diffusion, and not to mention that the company involved in its creation, Stability.ai, has its for-profit version called DreamStudio active.

So while all the messaging on the sites says “for research only,” it all has a wink-wink vibe in the way that everyone is using it, and in the permissiveness of the license, and in the company’s own practice.

There friends, is where I fell for the classic, well-everyone-else-is-doing-it bit. And you know what an over-fit machine learning model will tell you to do if it’s trained on everyone else doing it? Jump in.

## Part Two: Safety

Look, you can generate terrible, terrible images with these things if you’re set on it. The original model has an NSFW filter at the tail end. However, for the coder, it’s trivial to disable. 

I decided to put my checker up front, checking the text, do the best I could to account for the [Scunthorpe problem](https://en.wikipedia.org/wiki/Scunthorpe_problem) and leave it at that. I even pat myself on the back because at least in my version, there isn’t a feasible way of disabling the security check without breaking your phone. And I was prepared to enable an additional NSFW filter at the end.

Could someone still find the magic word combo to generate awful images? Undoubtedly. The tradeoff of letting the fast majority of well meaning people with an iPhone or iPad or Mac generate images for their business or for fun seemed to outweigh the potential harm. So, I considered myself good there.

## Part Three: Robots Taking Jobs

One thing that you’ve got to consider in ML is, are you going to automate people away? On the level of society, I think we’ll always have work that people want done. Every time I make software that does a job 10 times better someone says, “that’s great, now could it also do 20 other things?” Even if we got to the point where AI generated 100 percent of what we need, we would probably demand that the quality of what we have increase by 1,000 percent, and/or we would consume 10,000 times as much. And folks would find work making that happen.

The bigger concern is in the micro picture. Sure technology can eventually create more jobs, but you have real people who have to sacrifice time and energy retraining for those jobs. The shift isn’t without cost.

That’s big picture, but in the end, that cost is worthwhile to everyone involved, in my estimation. For image generation, the generator is more of a straightforward tool. Already, existing professional artists are the best at generating prompts to make the best art. Probably because their work involves so much communication with clients already about what they want. And there will be back and forth. A person will say, that’s not quite right, the character’s arm should be a little lower, and their brow should be more furrowed. And even if you could circle part of the image and dictate what you want, at that point it gets closer to Photoshop.

In the end, you need people at the helm of the tools, and folks making a living in visual arts will adapt, and probably adapt more quickly than a lot of transitions.

## Part Four: Exploitation

This is the part I couldn’t get past. 

I couldn’t exactly say, hey, you wrote “a rose” as your prompt so I give every copyrighted artist with “rose” in the prompt a 2 billionth of a cent. Mostly because that’s not how these ML systems work. You might’ve had an image of a “plant” or the color “red” for a red rose contribute but there really isn’t a way to clearly know.

For a bit I considered, hey, what if I set aside proceeds from my app to give to an artist advocacy organization, and give “royalties” voluntarily and as best I could that way?

That’s a nice gesture, but in the end, if everything went perfectly, I would be making bank on artists who in no way gave their consent to be used in a machine learning project. They were guarding their art and it was ripped from them. And I would be profiting. I could say, well it’s those Stability.ai folks who really should pay. If I release the app as is though, I’m part of the chain of responsibility. 

It’s also kind of egregious. I swear that half the prompts I see have [Greg Rutkowski’s](https://www.technologyreview.com/2022/09/16/1059598/this-artist-is-dominating-ai-generated-art-and-hes-not-happy-about-it/) name in there, and he had no say in his art getting used.

It’s murky enough when we worry that a person’s voice is stolen for a text-to-speech situation or an AI assistant. This is hundreds of times worse.

So that’s where I hang up my hat. I’m more amenable to folks using it for parody and play. If it stayed there it would be fine. But it can’t. The system is way too cool and useful. A lot of folks are going to make a lot of money. Just, for now, not me.

## Where to now?

You’ve probably noticed that I’ve said things like “for now” a lot. If Stability.ai trains on a checkpoint free of copyrighted material, I am down to use that. Or at least a checkpoint where artists have been given the chance to opt out. 

(Heaven knows I’ve toyed with the idea of training a model myself. Might take a little bit, but I know the precise steps.)

In the meantime, I’ll let the code get a little dusty. Close up the beta. And sigh at all the cool, for-profit demos people will post of Stable Diffusion derivatives.

Yes, the genie is out of the bottle. Doesn’t mean I have to make wishes.