# Game Project README

## Description
This project is a JavaScript-based game that involves tiles with various colors and numbers. Players interact with the game by rotating tiles, matching colors and numbers, and strategically placing them on a game board. The game includes features like player score tracking, image rotation, and API data fetching to customize the game tiles.

## Features
- Dynamic game board creation with clickable cells
- Tile rotation (clockwise and anti-clockwise)
- Player score tracking with up and down score adjustment buttons
- API data fetching to customize game tiles
- Real-time updates on player turn and round status

## Usage
- Click on a cell on the game board to place a tile.
- Rotate tiles clockwise or anti-clockwise using the provided buttons.
- Adjust player scores using the 'Up' and 'Down' buttons on the scoreboards.
- The game ends when all tiles have been placed on the board.

## API Data Customization
The game fetches data from an API to customize the game tiles. The API endpoint is set to `webservice/includes/actions.json` by default. To customize the game tiles, modify the data in the `actions.json` file or update the `customUrl` variable to point to a different API endpoint.

## Game Rules
- Players take turns placing tiles on the game board.
- Tiles must be placed adjacent to other tiles in a manner that matches the colors and numbers on the adjacent sides.
- Rotate tiles to match the adjacent colors and numbers using the provided rotation buttons.
- Players can adjust their scores using the 'Up' and 'Down' buttons on the scoreboards.
- The game ends when all tiles have been placed on the board.

# ToDo's

- Make the games save (localstorage)
- Front page better (frontend and backend)
- Make it possible to choose names and color