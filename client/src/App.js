import axios from 'axios';
 
import React,{Component} from 'react';
 
class App extends Component {
  
    state = {
      selectedFile: null,
      selectedType:'neuralN'
    };
    
    onFileChange = event => {
    
      this.setState({ selectedFile: event.target.files[0] });
      
    };
    
    onFileUpload = () => {
    
      const formData = new FormData();
    
      formData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      console.log(this.state.selectedFile);
    
      axios.post("api/upload/"+this.state.selectedType, formData).then(res => console.log(res.data));

    };

    onTypeChange = event =>{
      console.log(event.target.value)
      this.setState({selectedType: event.target.value});
    }
    
    fileData = () => {
    
      if (this.state.selectedFile) {
         
        return (
          <div>
            <h2>File Details:</h2>
             
<p>File Name: {this.state.selectedFile.name}</p>
 
             
<p>File Type: {this.state.selectedFile.type}</p>
 
             
<p>
              Last Modified:{" "}
              {this.state.selectedFile.lastModifiedDate.toDateString()}
            </p>
 
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        );
      }
    };
    
    render() {
    
      return (
        <div>
            <h1>
              Models Training
            </h1>
            <div>
                <input type="file" onChange={this.onFileChange} />
                
                <label for="model">Choose a model:</label>
                <select id="model" value={this.state.selectedType} onChange={this.onTypeChange} >
                  <option value="neuralN">Neural Network</option>
                  <option value="linearR">Linear Regression</option>
                </select>

                <button onClick={this.onFileUpload}>
                  Upload!
                </button>
            </div>
          {this.fileData()}
        </div>
      );
    }
  }
 
  export default App;
