import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
        let sad = parseFloat(JSON.stringify(this.props.emotions[0]["Sadness"]));
        let joy = parseFloat(JSON.stringify(this.props.emotions[1]["Joy"]));
        let fear = parseFloat(JSON.stringify(this.props.emotions[2]["Fear"]));
        let disgust = parseFloat(JSON.stringify(this.props.emotions[3]["Disgust"]));
        let anger = parseFloat(JSON.stringify(this.props.emotions[4]["Anger"]));
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
            <div>
                <tr>
                    <td>Sadnesss</td>
                    <td>{sad}</td>
                </tr>
                <tr>
                    <td>Joy</td>
                    <td>{joy}</td>
                </tr>
                <tr>
                    <td>Fear</td>
                    <td>{fear}</td>
                </tr>
                <tr>
                    <td>Disgust</td>
                    <td>{disgust}</td>
                </tr>
                <tr>
                    <td>Anger</td>
                    <td>{anger}</td>
                </tr>
            </div>
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
