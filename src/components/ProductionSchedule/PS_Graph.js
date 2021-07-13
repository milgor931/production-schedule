import React, { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';

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
import { jobs, shopData } from './data.js';

const sources = [
  { value: 'units', name: 'Units' },
  { value: 'emps', name: 'Employees' },
];

const Graph = (props) => {
  const [ state, setState ] = React.useState({});
  const [ data, setData ]  = useState([]);
  const [ shops, setShops ] = useState(["Shop A", "Shop B"]);

  useEffect(() => {
    calculateForOffSets();
  }, [ state ])

  const calculateForOffSets = () => {
    let all_data = [];
    jobs.forEach(job => {
      for (let w = 0; w < job.weeks; w++) {
        all_data.push({ shop: job.shop, offSet: (job.offSet + w), unitsPerWeek: job.unitsPerWeek, emps: job.emps })
      }
    })

    let filtered = all_data.filter(d => state[d.shop]);
    let new_data = [];

    let num = Math.max(...filtered.map(item => item.offSet));
    for (let i = 0; i < num; i++) {
      let total_units = 0;
      let total_emps = 0;
      filtered.forEach(d => {
        if (d.offSet === i) {
          total_units += d.unitsPerWeek;
          total_emps += d.emps;
        }
      })
      new_data.push({ offSet: i, units: total_units, emps: total_emps})
    }
    setData(new_data);
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const convertDaysToMilliseconds = (days) => {
    return days * 24 * 60 * 60 * 1000;
  }

  const convertMillisecondsToDays = (ms) => {
    return Math.ceil(ms / (24 * 60 * 60 * 1000));
  }

  const convertToDate = (value) => {
    let date = (value * 7) + convertMillisecondsToDays(new Date('7/1/2021').getTime());
    date = new Date(convertDaysToMilliseconds(date));
    return date.toLocaleDateString();
  }

  const shopSwitches = shops.map(shop => (
      <FormControlLabel
        key={shop}
        control={
          <Switch 
            name={shop} 
            id={shop}
            checked={state[shop]} 
            onChange={handleChange} 
          />
        }
        label={shop}
      />
  ))

  return (
    <Paper elevation={5}>
      <FormGroup row style={{position: 'fixed', 'top': 0, width: '100%', margin: '50px'}}>
          {shopSwitches}
        </FormGroup>
      <Chart
        // palette="Violet"
        dataSource={data}
        title="Units and Employees Over Time"
        style={{margin: '50px', position: 'fixed', top: '75px', width: '90vw'}}
      >
        <CommonSeriesSettings
          argumentField="offSet"
          type={"spline"}
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
          <Label  customizeText={data => convertToDate(data.value)}/>
        </ArgumentAxis>
        <Legend
          verticalAlignment="center"
          horizontalAlignment="right"
        />
        <Export enabled={true} />
        <Tooltip enabled={true} />
      </Chart>

    </Paper>
  );
}

export default Graph;