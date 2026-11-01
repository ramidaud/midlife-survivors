There's a new button on the main menu. It's cream colored, it sits right next to Devlog, and it says **BUY THE DEV A COFFEE**.

I went back and forth on that button for a while, because asking for money feels weird. I've been a photographer for twenty-some years. I know how to send an invoice for work somebody hired me to do. Putting out a tip jar for a game nobody asked for uses a totally different muscle, and mine is out of shape.

So I want to be upfront about where the money goes.

## The coffee is mostly AI

This game is being built by one photographer and a handful of AI tools. Claude writes most of the code. ChatGPT draws the art. Gemini and Grok review the design and push back on it. I bring the vision, the jokes and the "no, that doesn't feel right yet."

Those tools aren't free, and they aren't unlimited. Right now I'm at my weekly limit with Claude. I burned through a whole month of Gemini in one day.^[Some of that is my own fault. Every session ends with updated docs, a progress log, a textbook chapter and a devlog post. That paperwork eats usage. It's also the whole point: I want people to see how this thing actually gets made, mistakes included.]

So any early tips go to **more AI time to get this game finished.** Higher plans, more sessions, more art passes. If there's ever more than that, I'll tell you here first.^[It goes through Ko-fi, which keeps 0% of one-time tips. PayPal or Stripe still take a small processing cut.]

## Why now

Four days ago, my wife and I had twins.

![Pixel-art version of a photo of newborn twins side by side in striped hospital hats, one awake and looking over, one asleep.](img/05-twins-pixel.png)

I'm not going to pretend that doesn't matter. Two new humans is real financial pressure, and like everybody, I wish I made a little more. But that's not what this button is for. Holding a newborn at 3 a.m. just made it clear to me that I want to finish the things I start, and to let my kids see me make things I care about.^[In this house the 3 AM Thought is basically a documentary now.]

So I'm throwing my net out. Not for a payday. For people.

## Looking for my crew

What I'd really love is to find a small group of people who want to see this game get made, and maybe help make it.

- **Play it and tell me what's wrong.** Too easy, too hard, not funny, funny in the wrong place. Playtest notes are gold.
- **Bring a skill.** Pixel art, sound, music, game design, code, writing jokes about the DMV. If any of that is you, I'd love to talk.
- **Share it** with a friend who just turned 40. They'll get it.
- **Buy a coffee** if you want to and can. It keeps the AI running.

The button itself is about the smallest piece of code in the whole game:

```js src/ui.js
// Ko-fi tip jar: opens in a new tab so your run stays put
bindNavItem(coffeeBtn, 10, () => {
  window.open("https://ko-fi.com/ramidaud", "_blank", "noopener");
});
```

That `"_blank"` means it opens in a new tab. I asked for that on purpose. If you're nice enough to buy me a coffee, the least I can do is not lose your game.

## No coffee required

Everybody's budget is spoken for, mine included. Playing, sharing, or telling me the Donut is too strong helps this project just as much. If you want to get involved, you can find me through my [About page](https://ramidaud.github.io/midlife-survivors/devlog/about/).

Now go survive a few years. I'll be over here, running on very little sleep and whatever AI time I have left this week.
