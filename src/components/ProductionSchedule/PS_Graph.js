import React, { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format
} from 'devextreme-react/chart';
import { sources, tasks, shopData } from './data.js';
import { graphData } from './graphData.js';

const Graph = (props) => {
  const [state, setState] = React.useState({});

  const [ options, setOptions ] = useState([]);
  const [ data, setData ]  = useState([]);

  const handleChange = (event) => {
    setOptions([ ...options, event.target.id]);
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {

    // use map
    for (let i = 0; i < options.length; i++) {
      shopData[options[i]].forEach(shop => {
        for (let day = 0; day < 31; day++){

          setData([...data, {
            week: new Date(shop.week).getDate()+day,
            units: shop.units,
            emps: shop.emps
          }])

        }
      })
    }
  }, [options])


  const shopSwitches = shopData.map(shop => (
      <FormControlLabel
        key={shop[0].name}
        control={
          <Switch 
            name={shop[0].name} 
            id={shopData.indexOf(shop)}
            checked={state[shop[0].name]} 
            onChange={handleChange} 
          />
        }
        
        label={shop[0].name}
      />
  ))

  return (
    <React.Fragment>
      <Chart
        // palette="Violet"
        dataSource={graphData}
        title="Units and Employees Over Time"
        style={{margin: '50px', position: 'fixed', top: '0px', width: '90vw'}}
      >
        <CommonSeriesSettings
          argumentField="day"
          type={"stackedspline"}
        />
        <CommonAxisSettings>
          <Grid visible={true} />
        </CommonAxisSettings>
        {
          sources.map(function(item) {
            return <Series key={item.value} valueField={item.value} name={item.name} />;
          })
        }
        <Margin bottom={20} />
        <ArgumentAxis
          allowDecimals={false}
          axisDivisionFactor={60}
        >
          <Label visible={true} backgroundColor="#c18e92" />
        </ArgumentAxis>
        <Legend
          verticalAlignment="center"
          horizontalAlignment="right"
        />
        <Export enabled={true} />
        <Tooltip enabled={true} />
      </Chart>
      
      <FormGroup row style={{margin: '50px', top: 0}}>
        {shopSwitches}
      </FormGroup>
    </React.Fragment>
  );
}

export default Graph;
