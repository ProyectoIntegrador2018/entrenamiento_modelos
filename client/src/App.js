import axios from 'axios';
import {ExcelRenderer} from 'react-excel-renderer';
 
import React,{Component} from 'react';
 
class App extends Component {
  
    state = {
      selectedFile: null,
      selectedType:'neuralN',
      headers: null,
      rows: null,
      selectedVariable: null,
      trainVariables : null,
    };
    
    onFileChange = event => {
    
      this.setState({ selectedFile: event.target.files[0] });

      let fileObj = event.target.files[0];

      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          this.setState({
            headers: resp.rows[0],
            rows: resp.rows.slice(1,11),
            selectedVariable : 0,
            trainVariables : [...Array(resp.rows[0].length)].map((u, i) => false)
          });
        }
      }); 

    };


    onFileUpload = () => {
    
      const formData = new FormData();
    
      formData.append(
        "file",
        this.state.selectedFile,
       
        
      );
    
      formData.append("variable",
      this.state.selectedVariable)
      formData.append("variables",
        this.state.trainVariables
      )
    
      axios.post("api/upload/"+this.state.selectedType, formData).then(res => console.log(res.data));

      console.log(this.state)
    };

    onTypeChange = event =>{
     
      this.setState({selectedType: event.target.value})


    }
    
    onVariableChange = event =>{
      this.setState({selectedVariable: parseInt(event.target.value)})

    }

    getVariable = () => { if(this.state.headers){
      
      return  (
        <div>
              <label for="variable" >Choose a variable to predict:</label>
              <select  onChange={this.onVariableChange}>
                {Object.entries(this.state.headers).map((item) => {    
                            
                  return (
                    <option value={item[0]}  key={item[0]}>{item[1]}</option>
                  
                  );
                })}
              </select>
        </div>
      )
    }

    }

    headersChange = event => {


      this.setState(state => {
        const list = state.trainVariables.map((item, j) => {
        
          if (j === parseInt(event.target.value)) {
            
            return event.target.checked;
          } else {
            return item;
          }
        });
        return {
          trainVariables : list
        }
      })
    }

    getTableHead = () => { if(this.state.headers){

      return (
          <tr>
          {Object.entries(this.state.headers).map((item) => {                                
            
            return (
              
              <th key={item[1]}>
               { item[1]}  <input type="checkbox" value={item[0]}  onChange={this.headersChange} ></input>
              </th>
            );
          })}
          </tr>

      );
    }}

    getTableBody() { if(this.state.rows){
 
  
      return  (
        <tbody>
          {Object.entries(this.state.rows.slice(0,10)).map((item) => {    
          
            return ( 
            <tr key={item[0]}>             
            {Object.entries(item[1]).map((field) => {  
             
            return (
                      // changed here
                   <td key={field[0]}>{field[1]}
                   </td>
               );
            
            })} 
            </tr> )
          })}
        </tbody>
      );
    }}

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
            <div >
                <input type="file" onChange={this.onFileChange} />
                <br></br>
                <label for="model" >Choose a model:</label>
                <select id="model" value={this.state.selectedType} onChange={this.onTypeChange} >
                  <option value="neuralN" >Neural Network</option>
                  <option value="linearR" >Linear Regression</option>
                </select>

                {this.getVariable()}

                <h3>Select variables to train model</h3>
                <table>
                <thead>
                  {this.getTableHead()}
                </thead>   
             
                  {this.getTableBody()}
              
                </table>
                

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
