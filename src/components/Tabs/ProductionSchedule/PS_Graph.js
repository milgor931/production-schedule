import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
} from 'devextreme-react/chart';
import { Typography } from '@material-ui/core';
import { addDays } from 'date-fns';

const sources = [
  { value: 'units', name: 'Units' },
  { value: 'emps', name: 'Employees' },
];

const Graph = (props) => {
  const { data, toMondayDate, addDays } = props;
  const [ state, setState ] = React.useState({});
  const [ graphData, setGraphData ] = useState([]);

  const jobs = data.jobs ? data.jobs : [];
  const shops = data.shops ? data.shops : [];

  useEffect(() => {
    calculateForOffSets();
  }, [ state ])

  const calculateForOffSets = () => {
    let all_data = [];
    jobs.forEach(job => {
      for (let w = 0; w < job.weeks; w++) {
        all_data.push({ shop: job.shop, offset: (job.offset + w), unitsPerWeek: job.unitsPerWeek, emps: job.emps, groupKey: job.groupKey })
      }
    })

    let filtered = all_data.filter(d => state[d.groupKey]);
    let new_data = [];

    let num = Math.max(...filtered.map(item => item.offset));
    for (let i = 0; i < num; i++) {
      let total_units = 0;
      let total_emps = 0;
      filtered.forEach(d => {
        if (d.offset === i) {
          total_units += parseInt(d.unitsPerWeek);
          total_emps += parseInt(d.emps);
        }
      })
      new_data.push({ offset: i, units: total_units, emps: total_emps})
    }
    setGraphData(new_data);
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const convertToDate = (value) => {
    const date = addDays(toMondayDate(new Date()), value * 7);
    return date.toLocaleDateString();
  }

  const shopSwitches = shops.map(shop => (
      <Grid item key={shop.__KEY__}>
        <FormControlLabel
          control={
            <Switch 
              name={shop.__KEY__} 
              id={shop.__KEY__}
              color="primary"
              checked={state[shop.__KEY__]} 
              onChange={handleChange} 
            />
          }
          label={shop.shop}
        />
      </Grid>
  ))

  return (
    <Grid container direction="row" style={{width: '100%'}}>
          <Grid item style={{width: '10vw'}} >
              <FormGroup style={{marginTop: '50px', padding: '10px'}}>
                <Typography>
                  Choose Shops
                </Typography> 
                {shopSwitches}
              </FormGroup>
          </Grid>
        <Grid item style={{width: "80vw", marginTop: "20px"}}>
          <Chart
            dataSource={graphData}
            title="Units and Employees Over Time"
          >
            <CommonSeriesSettings
              argumentField="offset"
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
              <Label customizeText={data => convertToDate(data.value)}/>
            </ArgumentAxis>
            <Legend
              verticalAlignment="center"
              horizontalAlignment="right"
            />
            <Export enabled={true} />
            <Tooltip enabled={true} />
          </Chart>
        </Grid>
      </Grid>
  );
}

export default Graph;