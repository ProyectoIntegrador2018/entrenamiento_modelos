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
      selectAllChecked : false,
      progession : []
    };
    
    
      onFileChange =  ( event) => {
        console.log(event.target.files[0])
       if(event.target.files[0] ){
          this.setState({ selectedFile: event.target.files[0] , rows : null, headers : null, selectedVariable : null, trainVariables : null, selectAllChecked : false,
                            progession: [], variableToCompare : 0, coefficient:null});
  
          let fileObj = event.target.files[0];
          
          //just pass the fileObj as parameter
        
             ExcelRenderer( fileObj, (err, resp) => {
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
          } 
      }
  
      getProgress = (index) =>{
        let arr = []
        if(index > 0)
          arr = this.state.progession
      
          axios.get("api/progress",{
            params:{
              name:this.state.selectedFile.name,
              index : index 
            }
          }).then(res => {
            
            arr.push(res.data)
            this.setState({progession : arr})
            if(index < 19)
              this.getProgress(index+1)

          });
          
          
        console.log(arr)

      
    }

    onFileUpload = () => {
    
      const formData = new FormData();
      this.setState({progession : [], coefficient : null})
      formData.append(
        "file",
        this.state.selectedFile,
       
        
      );
    
      formData.append("variable",
      this.state.selectedVariable)
      formData.append("variables",
        this.state.trainVariables)
      formData.append("name",
      this.state.selectedFile.name)
    
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
      this.getProgress(0);
    

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
      if(this.state.rows){
      this.setState({variableToCompare: parseInt(event.target.value)});
      
      var provitionalXAxis = [];
      this.state.rows.map((row) => {provitionalXAxis.push(row[parseInt(event.target.value)])});
      this.setState({
        xAxis: provitionalXAxis,
        xLabel: this.state.headers[parseInt(event.target.value)],
      });
    }
    }

    getVariable = () => { if(this.state.headers){
      
      return  (
        <div>
              <label >Choose a variable to predict:</label>
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
              <th key={item[1]} >
                <label htmlFor={item[1]} >{ item[1]}</label>
                 <input type="checkbox" value={item[0]} id={item[1]} onChange={this.headersChange} checked={this.state.trainVariables[item[0]]} ></input>
              </th>
            );
          })}
          </tr>

      );
    }}

    getTableBody () { if(this.state.rows){
 
  
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

    displayProgress(){
      if(this.state.progession.length > 0){
        return (
        <div>
          {Object.entries(this.state.progession).map((item) => {    
            return(
          
              <p key={item[0]} >Result after epoch {item[0]}  accuracy : {item[1]}</p> 
           
            )
        })}
        </div>
        )
      } 
    }

    resultData = () => {
      if(this.state.headers == null)
        return(<div></div>)

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
          <div>{this.displayProgress()}</div>

          {this.state.coefficient!==null ?
            (
              <div>
                <label  >Choose a variable to compare with the predicted variable:</label>
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
            ) : (<div></div>)
          }
        </div>
      );
    };

    onSelectAll = event => {
      const checked = event.target.checked
      
    
      this.setState(state => {
        const list = state.trainVariables.map((item, j) => {
        
          
            
            return checked
          
        });
        return {
          trainVariables : list,
          selectAllChecked : checked
        }
      })
    }

    SelectAll = () => {
      if (this.state.selectedFile){
        return  (
          <div>
            <label>Select all: </label>
            <input type="checkbox" onChange={this.onSelectAll} checked={this.state.selectAllChecked}></input>

          </div>
        )
      }

    }
    
    render() {
    
      return (
        <div>
            <h1>
              Models Training
            </h1>
            <div >
                <input type="file" onChange={this.onFileChange} />
                <br></br>
                <label >Choose a model:</label>
                <select id="model" value={this.state.selectedType} onChange={this.onTypeChange} >
                  <option value="neuralN" >Neural Network</option>
                  
                  <option value="randomFC">Random Forest Classification</option>
                  <option value="randomFR">Random Forest Regression</option>
                </select>

                {this.getVariable()}

                <h3>Select variables to train model</h3>
                <div>
                  {this.SelectAll()}
                </div>
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
