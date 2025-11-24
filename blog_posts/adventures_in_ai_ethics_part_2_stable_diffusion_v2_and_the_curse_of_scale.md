---
title: Adventures in AI Ethics Part 2: Stable Diffusion v2 and the Curse of Scale
date: 2022-12-12
slug: adventures-in-ai-ethics-part-2-stable-diffusion-v2-and-the-curse-of-scale
---
I outlined [here](https://www.cephalopod.studio/blog/on-creating-an-on-device-stable-diffusion-app-amp-deciding-not-to-release-it-adventures-in-ai-ethics) why I had ethical issues about making an iOS app with Stable Diffusion, the machine learning system that creates images with a text prompt.

In the end, I didn’t like that artists were releasing their art online saying, “Hey, you can use this, but not for commercial purposes okay?” 

And the companies that used billions of images for possibly millions of such artists said, sure, sure (wink), and then essentially used those images for commercial purposes.

There was no opt-in for artists. Not even an opt out. And more egregious, you can tell the AI to plagiarize an artist’s style by naming the artist in the prompt.

Central to this issue is the idea of [fair use](https://www.library.ucsb.edu/copyright-fair-use-basics), and the issue of fair use in machine learning isn’t a settled one. Consider [this lecture outline at Stanford](https://stanford-cs324.github.io/winter2022/lectures/legality/)..

”[Fair learning](https://texaslawreview.org/fair-learning/) argues that machine learning is fair use:

- ML system’s use of data is **transformative**, doesn’t change work, but changes purpose.

- ML system is interested in **idea** (e.g., stop sign) not in the concrete **expression** (e.g., exact artistic choices of a particular image of a stop sign).

- Arguments for ML as fair use:

- Broad access to training data makes better systems for society.

- If don’t allow, then most works cannot be used to produce new value.

- Using copyrighted data can be more fair [Levendowski, 2018](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3024938).

- Arguments against ML as fair use:

- Argue that ML systems don’t produce a creative “end product” but just make money.

- Generative models (e.g., language models) can compete with creative professionals.

- Problems with ML systems (spread disinformation, enable surveillance, etc.), so don’t give ML systems the benefit of the doubt.

- Challenge: hard to separate protectable (e.g., expression) from unprotectable (e.g., ideas).

- There are many reasons why building an ML system might be bad, but is copyright the right tool to stop it?”

In the end, the lecture concludes: “the future of copyright and machine learning in light of large language models is very much open.”

### AI is just doing what art students are doing, right?

That’s the common refrain I keep running into. Why do we tell an art student in their dorm that it’s okay to practice off of anything they can see but not the AI?

Here is where I think the vast majority of debates get stuck and muddled on a point of mechanics.

Folks will start to talk about why AI is different from human intelligence. You get to talking about the nature of intelligence and creativity, and what are those things, and can machines be truly creative and so on.

Shoot, even [the lawsuit against OpenAI and Microsoft](https://githubcopilotlitigation.com/pdf/06823/1-0-github_complaint.pdf) over their generative coding program, which I would put in the same bucket as StableDiffusion, gets caught up in this qualitative debate.

The talk about a bot making a silly coding mistake in Javascript that a human would never make. To which I say, buddy, let me tell you about the vast numbers of terribly silly Javascript mistakes we human programers have made.

Anyway, it’s not that those aren’t worthy topics to discuss, but there is another, different reason why we shouldn’t put the art student in their dorm and the machine learning system in the same bucket.

So I will, for the sake of argument, say that the learning of a human and the AI system is fundamentally the same. Yet there is still a reason to not treat them the same.

The reason is power.

### The Curse of Scale

If I go for a walk, I generally do not need a license. If I drive a car, then I need a license. And, although I am not an avionics expert, I would hope I’m required to have a significantly more thorough license to fly a 747.

Here in the U.S., you can get a license to own a handgun. You cannot, even in my state of Texas, get a license to have a nuke.

Machine learning systems have vastly more power that art students, and they need to be treated differently.

So the comparison isn’t between an art student and another art student who happens to be a bot. It’s more of a comparison of an art student and an army of trained artists who have been hired by a multi-millionaire to learn another artist’s style.

That seems less like fair use.

To bring the analogies closer to home, it’s kind of like, oh, I’m going to use the image of Batman in my meme to make a joke. I’m not going to use the image of Batman in my movie to sell a billion dollar blockbuster.

Or again, I might have friends over for a movie night, and even though they haven’t purchased the movie, we still all enjoy it together. I’m not going to create a chain of movie theaters and share that movie that way, charging people and keeping all the profits.

The release of Stable Diffusion is much like providing people a button to create their chain of movie theaters, or galleries rather, where they can charge people to come see ripoffs of other artist’s work.

My argument then, is that we need not consider the qualitative difference between a human artists and an AI artists. It’s enough to consider the quantitate difference. The AI system has more power.

### Stable Diffusion v2

[A new version of Stable Diffusion is out](https://www.theverge.com/2022/11/24/23476622/ai-image-generator-stable-diffusion-version-2-nsfw-artists-data-changes). This time, they disallowed the ability to directly include an artist’s name in the prompt, more or less.

What would be ideal is if they had offered a version of their model trained only on public data.

(Yes, folks could still attach artist’s names to images in the public dataset if they were similar to the artists, but it couldn’t truly capture their art. Or maybe that’s one of those qualitative debates I said I didn’t want to get stuck in.) 

Still, they are addressing a major complaint from artists in a way that helps with fair use.

Besides, we needn’t make an idol out of fair use. Its function is to protect the creator of the creation, and incentivize those people to keep creating.

Stable Diffusion v2 goes further toward protecting the creators. Does it go far enough?

I still wonder whether there is room for an image generator made from public images.

And together, as a society, we’ll sift out what should count as fair use (most of the reports I’ve read themselves report that most law experts believe the training will be considered fair use. Hmmm)

In the meantime then, I’ll take the politicians tactic of saying, do not make perfect the enemy of good, and, stick to using Stable Diffusion v2 if I make an image maker app.

Meanwhile, I really hope that folks can occasionally turn from the what-is-creativity debates at times and realize the amount of power that’s at play here in these ML systems. For machine learning, we are not comparing people to a merely different kind of person. We’re comparing people with giants.