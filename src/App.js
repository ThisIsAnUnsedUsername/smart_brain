import React, { Component } from 'react';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import Rank from './component/Rank/Rank';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const particlesOptions = {
  particles: {
    number: { value: 30, density: { enable: true, value_area: 800 } }
  }
};

const app = new Clarifai.App({
  apiKey: '019ad8a0976145d895e6bb075a3de5e1'
});
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    };
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState(
      {
        imageUrl: this.state.input
      },
      () => {
        app.models
          .predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
          .then(
            function(response) {
              console.log(
                response.outputs[0].data.regions[0].region_info.bounding_box
              );
            },
            function(err) {
              console.log(err);
              // there was an error
            }
          );
      }
    );
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />

        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
