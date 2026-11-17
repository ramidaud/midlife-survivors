I was missing bosses all the time, because I wasn't sure exactly which way to head for the boss fights. Even though I knew that they spawn in certain areas, I would kind of forget to go there, so a lot of the boss fights ended up trailing right behind each other.

Maple Hollow is big now. The town opens up as you age, one area at a time, and the bosses come out of their own parts of town. That's great for exploring. It's not great when you can't find the fight.

The play stats said the same thing. Every Maple Hollow run that got past 50 ended between 52 and 56 with the 30-Year Mortgage still alive. It spawns at the strip mall across town, and it took about two minutes to walk to you while the swarm piled up.

![A chart of the Mortgage's walk. Before the fix it took about two minutes to reach you, and every run past 50 died between 52 and 56. After the fix it takes about 30 seconds.](img/17-mortgage-walk.png)

The fix was simple: a boss that's far away hurries over, then slows down to fight once it reaches you. Now the walk takes about 30 seconds.^[Play data is how a lot of small developers find problems like this. PC Gamer has a good story about the solo developer of Cook, Serve, Delicious! 2!! learning from a friend's play metrics that one of his own challenges was impossible. Link below.]

PC Gamer's [How developers harvest your data to make their games better](https://www.pcgamer.com/how-developers-harvest-your-data-to-make-their-games-better) is a fun read on that. The play stats in Midlife Survivors are anonymous too: how far a run got, what ended it, and whether a boss was still around.

## Lost in the chaos

I was thinking about ways we could indicate where you needed to head in the game, and I couldn't really come up with a good visual indicator other than the arrows. Which are fine, but tend to get lost in the chaos of the game.

So the town got a map first. It sits in the corner from the start, since it's your own neighborhood, and a tap or M opens the whole town. Closed areas show the age they open, and a newly opened area gets an orange outline until you visit.

![The Maple Hollow map. Before: every area is closed woods with the age it opens. After: the elementary school just opened at 44, with an orange outline.](img/17-map-before.jpg "compare: img/17-map-before.jpg | img/17-map-after.jpg | Age 44")

There are edge arrows too, for bosses and for a new area. They help. But in the middle of a fight, you're not reading arrows.

## A natural way to get people to move around the map

So having the wave of enemies kind of push you in the right direction, I think, is a natural way to get people to move around the map.

We called them Moving Day waves. A couple of seconds after an area opens, a big wall of easy enemies comes in from the side away from it, with two tough ones in the middle. You can fight through them, but the easy way out is toward the new area.

<video src="img/17-push-wave.mp4" poster="img/17-push-wave.jpg" autoplay muted loop playsinline controls></video>

Level designers have a whole toolbox for this. Unity's [Level design basics: Guiding players without telling them](https://unity.com/blog/level-design-basics) walks through light, color, leading lines, landmarks and breadcrumbs. The last one on the list is movement: something moving through the scene can lead you without a word. Ours just happens to be a crowd of bills.

## Too similar to the office

That's what I'm struggling with. Sometimes I feel like it's too similar to the office, and I want to come up with some new approaches. It feels too similar to the office in terms of some of the enemies and attacks. They don't feel central to Maple Hollow just yet.

## On your left

Enemies that only make sense in a neighborhood. Maybe like aggressive fast walking, or a jogging club of some sort. Or road cyclists, yelling "on your left."

What else lives in your neighborhood that should be chasing me? Tell me on [Substack](https://ramidaud.substack.com) or in the [Discord](https://discord.gg/E6N9j5tZe).
