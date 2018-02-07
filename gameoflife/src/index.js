import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

class Main extends React.Component{
  constructor(){
    super();

    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation : 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }

  // Function to change the state of a grid where the selected Box is True
  // Recieves the row and col of the box
  // You have to create a copy and modify the copy
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    });
  }

  // Function to start the game with a random number of cells alive
  seed = () => {
    // Creates a copy of the grid
		let gridCopy = arrayClone(this.state.gridFull);
    // Iterates through the grid and randomly choose if cell is going to be alive
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (Math.floor(Math.random() * 4) === 1) {
					gridCopy[i][j] = true;
				}
			}
		}

		this.setState({
			gridFull: gridCopy
		});
	}

  // Function to start the game
  // Will call the function play each interval
  playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

  // Button for stoping the game
  pauseButton = () => {
		clearInterval(this.intervalId);
	}

  // Function for making all the squares in the grid dead
  clear = () => {
    clearInterval(this.intervalId);
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

  // Main function with the rules of the game
  play = () => {
    // Create the clone of the grid
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

    // Analize every element of the grid and check if the cell should live or die
    // Make the change in the clone grid
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        // Checks how many neighbors are alive
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;

        // Decide if cell should be alive or dead depending on the number of neighbors
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}



  // Function that will run each time the screen is loaded
  componentDidMount() {
		this.seed();
		this.playButton();
	}


  render(){
    return(
      <div>
        <h1>Game of Life</h1>
        <Buttons
					playButton={this.playButton}
					pauseButton={this.pauseButton}
					// slow={this.slow}
					// fast={this.fast}
					clear={this.clear}
					seed={this.seed}
					// gridSize={this.gridSize}
				/>
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

// Grid component for the grid where the game is played
class Grid extends React.Component{
  render(){
    // Get value of width from props passed from the Main component
    const width = this.props.cols * 14
    var rowsArr = []
    var boxClass = "";

    // Nested for loop for creating the grid
    for (var i = 0; i < this.props.rows; i++)
    {
      for (var j = 0; j < this.props.cols; j++)
      {
        let boxId = i + "_" + j;

        // Box class defines if the cell is alive or dead
        // This is for giving the different styles for the boxes
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";

        // Push a Box component to the array
        // Each Box component is equal to a cell
        // The selectBox function is passed from the Main component
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }

    // The html code that will be used when someone calls a Grid component
    return(
      <div className="grid" style={{width: width}}>
      {rowsArr}
      </div>
    );
  }
}

// Box component
// Each box is a cell
class Box extends React.Component {

  // Function to change the state of the box
  // This method is passed from the Grid component
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }

  // When someone calls a Box component they will use this html code
  // It is a div with an unique ID and an onClick Function
  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

// Button component
// Section of the page with all the buttons
class Buttons extends React.Component {
	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					{/* <button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>*/}
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
					{/* <DropdownButton
						title="Grid Size"
						id="size-menu"
						onSelect={this.handleSelect}
					>
						<MenuItem eventKey="1">20x10</MenuItem>
						<MenuItem eventKey="2">50x30</MenuItem>
						<MenuItem eventKey="3">70x50</MenuItem>
					</DropdownButton> */}
				</ButtonToolbar>
			</div>
			)
	}
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main/>, document.getElementById('root'));
