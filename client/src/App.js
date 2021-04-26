import axios from 'axios';
import {ExcelRenderer} from 'react-excel-renderer';
import { Doughnut, Line } from 'react-chartjs-2';
 
import React,{Component} from 'react';
 
class App extends Component {
  
    state = {
      selectedFile: null,
      selectedType:'neuralN',
      variableToCompare: 0,
      headers: null,
      rows: null,
      xAxis: [],
      yAxis: [],
      selectedVariable: null,
      trainVariables : null,
      xLabel: "",
      yLabel: "",
      coefficient: null,
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
            trainVariables : [...Array(resp.rows[0].length)].map((u, i) => false),
            coefficient: null
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
    
      axios.post("api/upload/"+this.state.selectedType, formData).then(res => {
        this.setState({coefficient: res.data});
        var provitionalXAxis = [];
        var provitionalYAxis = [];
        this.state.rows.map((row) => {provitionalXAxis.push(row[this.state.variableToCompare])});
        this.state.rows.map((row) => {provitionalYAxis.push(row[this.state.selectedVariable])});
        this.setState({
          xAxis: provitionalXAxis,
          yAxis: provitionalYAxis,
          xLabel: this.state.headers[this.state.variableToCompare],
          yLabel: this.state.headers[this.state.selectedVariable],
        });
      });
      
      console.log(this.state)
    };

    onTypeChange = event =>{
     
      this.setState({selectedType: event.target.value})


    }
    
    onVariableChange = event =>{
      this.setState({selectedVariable: parseInt(event.target.value)});
      console.log(event.target.value);
      var provitionalYAxis = [];
      this.state.rows.map((row) => {provitionalYAxis.push(row[parseInt(event.target.value)])});
      this.setState({
        yAxis: provitionalYAxis,
        yLabel: this.state.headers[parseInt(event.target.value)],
      });
    }

    onVariableToCompareChange = event =>{
      this.setState({variableToCompare: parseInt(event.target.value)});
      console.log(event.target.value);
      var provitionalXAxis = [];
      this.state.rows.map((row) => {provitionalXAxis.push(row[parseInt(event.target.value)])});
      this.setState({
        xAxis: provitionalXAxis,
        xLabel: this.state.headers[parseInt(event.target.value)],
      });
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

    resultData = () => {

      const data = {
        labels: ['Success', 'Failure'],
        datasets: [
          {
            label: 'Coefficient',
            data: [this.state.coefficient, 1- this.state.coefficient],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const lineData = {
        labels: this.state.xAxis,
        datasets: [
          {
            label: "Actual Values " + this.state.yLabel + " against " + this.state.xLabel,
            data: this.state.yAxis,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
      
      return (
        <div>
          <h2>Results</h2>
          {this.state.coefficient!==null && 
            (
              <div>
                <label for="variableToCompare" >Choose a variable to compare with the predicted variable:</label>
                <select  onChange={this.onVariableToCompareChange}>
                  {Object.entries(this.state.headers).map((item) => {    
                              
                    return (
                      <option value={item[0]}  key={item[0]}>{item[1]}</option>
                    
                    );
                  })}
                </select>
                <div>coefficient: {this.state.coefficient}</div>
                <div style={{ position: "absolute", margin: "auto", width: "30vh", height: '30vh' }}>
                  <Doughnut  data={data} options={{responsive: true, maintainAspectRatio: false}}/>
                </div>
                <div style={{ position: "relative", margin: "auto", width: "30vh", height: '30vh' }}>
                  <Line  data={lineData} options={{responsive: true, maintainAspectRatio: false}}/>
                </div>
              </div>
            )
          }
        </div>
      );
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
          {this.resultData()}
        </div>
      );
    }
  }
 
  export default App;
