There's a new button on the main menu. It's cream colored, it sits right next to Devlog, and it says **BUY THE DEV A COFFEE**.

I went back and forth on that button for a while, because asking for money feels weird. I've been a photographer for twenty-some years. I know how to send an invoice for work somebody hired me to do. Putting out a tip jar for a game nobody asked for uses a totally different muscle, and mine is out of shape.^[It goes to Ko-fi, which keeps 0% of one-time tips. PayPal or Stripe still take their small processing cut. I looked that up before anything else, because if I'm going to feel awkward about this, the coffee money should at least make it to the coffee.]

## So why now

Four days ago, my wife and I had twins.

Two of them. At once. I added two brand-new characters to my life in a single afternoon, and unlike a Bill, they don't split into Late Fees when you ignore them. They just get louder.^[They will not be getting enemy sprites. Probably.]

Something happens when you're holding a newborn at 3 a.m. (In this house the 3 AM Thought is basically a documentary now.) You start thinking about what you want them to see you do. My honest answer is that I want them to see me make things I care about. Photographs. Framing the Cosmos. A ridiculous game where your coffee fights paperwork.

So I'm throwing my net out. I'm not quitting anything and I'm not betting the house. I'm just putting the things I love where people can find them, and leaving a door open in case someone wants to help keep the lights on.

## What the button does, and what it doesn't

- **The game stays free.** No ads, no paywall, no "watch a video to revive."
- **It never shows up mid-run.** It lives on the main menu, the Game Over screen and here in the devlog. That's it.
- **If you tip, I'll spend it on coffee.** And, increasingly, on diapers.

The button itself is about the smallest piece of code in the whole game:

```js src/ui.js
// Ko-fi tip jar: opens in a new tab so your run stays put
bindNavItem(coffeeBtn, 10, () => {
  window.open("https://ko-fi.com/ramidaud", "_blank", "noopener");
});
```

That `"_blank"` means it opens in a new tab. I asked for that on purpose. If you're nice enough to buy me a coffee, the least I can do is not lose your game.^[`noopener` is a small safety thing. It stops the new tab from reaching back and messing with the game's tab. Claude explained it as "close the door behind you," which I liked.]

## If you can't, that's completely fine

Twins taught me fast that everybody's budget is spoken for. Playing the game, sending it to a friend who just turned 40, or telling me the Donut is too strong all help just as much as a coffee does.

The best thing you can do is go survive a few years. I'll be over here, running on very little sleep and a lot of coffee.
