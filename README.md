## Tetris

### Table of Contents

<!--ts-->

 * [Description](#️-description)
 * [Gameplay](#️-gameplay)
 * [Requirements](#-requirements)
   * [State Diagram](#-state-diagram)
   * [Class Diagram](#️-class-diagram)
   * [Wireframes](#-wireframes)
   * [Assets](#-assets)
     * [Images](#️-images)
     * [Fonts](#️-fonts)
     * [Sounds](#-sounds)
* [References](#-references)

<!--te-->

### ✒️ Description

In this classic retro arcade game, players aim to fit varying block shapes
(tetrominoes) into a fixed sized board with the purpose of eliminating rows
and increasing their score. Placing a block in a full column implies game
over and a certain score met implies a level win. The player wins the game by
successfully completing all levels.

### 🕹️ Gameplay

Players begin by selecting the current level they wish to start at, the higher
the level the player selects, the higher the speed in which tetrominoes fall and
the score threshold for successful completion of that level.

Once a level is selected, players are met with an empty board, score counter,
line counter, a `next` section and a `hold` section. The `next` section stores
upcoming tetrominoes and the `hold` section allows for the swapping of the
current tetromino with the next one in the queue.

During gameplay, players can move the current tetromino left, right and down
with the keys `a` and `d` and `s` respectively. Moreover, players can rotate
the tetromino 90 degrees with the `w` key.

When a player meets the score threshold for the current level, they transition
to the next level. If the player places a tetromino in a full column, the game
ends. Lastly, if the player meets the score threshold on the final level, they
win the game.

### 📃 Requirements

TODO

#### 🤖 State Diagram

TODO

#### 🗺️ Class Diagram

TODO

#### 🧵 Wireframes

TODO

#### 🎨 Assets

TODO

##### 🖼️ Images

TODO

##### ✏️ Fonts

TODO

##### 🔊 Sounds

TODO

#### 📚 References

TODO
