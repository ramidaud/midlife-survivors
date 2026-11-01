I'm a photographer. I've spent twenty-some years figuring out where to stand and when to press the button. I have never made a video game. Not a little one in college, not a Flash thing in 2006. Nothing.

But I've played a lot of Vampire Survivors. If you haven't: you walk around, your weapons fire on their own, and an absurd number of monsters try to touch you. That's it. It's the most relaxing stressful thing I own.^[Vampire Survivors came out in 2022 from a tiny studio called poncle, and it started life as a browser game. That's part of why mine runs in a browser too.]

Somewhere around my forties I realized midlife works the same way. You don't get to choose your attacks anymore. You just keep moving while the bills, the robocalls and the weird new back pain close in.

So that's the game. **Midlife Survivors.** You start at 40. You survive.

## The vision part (that's my job)

Before any code, I wrote down my Top 10 midlife annoyances. Bills. Phone calls. Diabetes. Fat. Work drama. Sleep. Aches and pains. Kids' math homework. Errands. Death.

That list turned into the enemies. A Bill chases you, and if you don't pay it off fast it splits into Late Fees. "Spam Likely" rings before it charges. Donuts slow you down if you touch them. Death shows up at the end and can't be beaten, because, well.^[He got a promotion since this was written. In the main game, the ending at 65 is your Retirement Party. Death still waits at 100 in Full Life mode.]

## The AI part (that's Claude's job)

I'm building this with Claude as my co-developer. I describe what I want to see and feel, and it writes the code and explains what it did in plain English. It's like working with a patient engineer who never gets tired of "wait, what's a game loop?"^[A game loop is the bit of code that runs about 60 times a second: move everything, check what's touching, redraw the screen. Every single thing in the game happens inside it.]

The first thing we built was a square. You could move it with the arrow keys or by dragging on your phone. That's the whole game at that point: a square on an endless carpet.

Then a green dollar sign showed up and started chasing it. I laughed way harder than I should have.

<!-- SCREENSHOT: first build, the square and the first Bill -->

## The learning part (that's the point)

Every session ends with one new idea I actually understand. The first one: a game redraws the screen about 60 times a second, and everything you see happens inside that loop. Move the player, move the enemies, check if they're touching, draw it all again. Sixty times. Every second.

That one blew my mind a little.

Next up: a coffee splash that fires on its own, and the first time I got hit by a Bill and died.
