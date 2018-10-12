import React, { Component } from 'react';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import Rank from './component/Rank/Rank';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import './App.css';
import Signin from './component/Signin/Signin';
import Register from './component/Register/Register';

const particlesOptions = {
  particles: {
    number: { value: 30, density: { enable: true, value_area: 800 } }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState(
      {
        imageUrl: this.state.input
      },
      () => {
        fetch('https://enigmatic-springs-19215.herokuapp.com/imageurl', {
          method: 'post', //default method is get
          headers: { 'Content-Type': 'application/json' }, //header define type, property name is string because got symbol
          body: JSON.stringify({
            input: this.state.input
          })
        })
          .then(response => response.json())
          .then(response => {
            fetch('https://enigmatic-springs-19215.herokuapp.com/image', {
              method: 'put', //default method is get
              headers: { 'Content-Type': 'application/json' }, //header define type, property name is string because got symbol
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState({ user: { ...this.state.user, entries: count } }); //this will initialize entire user object, removing other info in user object
              })
              .catch(console.log);
            this.displayFaceBox(this.calculateFaceLocation(response));
          })
          .catch(err => console.log(err));
      }
    );
  };

  onRouteChange = route => {
    if (route === 'signout') {
      //this.setState({ isSignedIn: false });
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box, user } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
