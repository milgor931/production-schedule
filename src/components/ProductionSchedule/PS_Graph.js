import React, { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Spinner from '../Spinner';
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
  Format
} from 'devextreme-react/chart';
import axios from 'axios';
import { Typography } from '../../../node_modules/@material-ui/core';

const sources = [
  { value: 'units', name: 'Units' },
  { value: 'emps', name: 'Employees' },
];

const Graph = (props) => {
  const { data, handleUpdate } = props;
  const [ state, setState ] = React.useState({});
  const [ jobs, setJobs ] = useState([]);
  const [ shops, setShops ] = useState(["Shop A", "Shop B"]);
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    if (data) {
      setShops(findShopDups().reverse())
      setLoaded(true);
    }
  }, [ data ])

  useEffect(() => {
    setLoaded(false);
    jobs && calculateForOffSets();
    setLoaded(true);
  }, [ state ])

  const findShopDups = () => {
    const unique = [...new Set(data.map(item => item.shop))];
    return unique;
  }

  const calculateForOffSets = () => {
    let all_data = [];
    data.forEach(job => {
      for (let w = 0; w < job.weeks; w++) {
        all_data.push({ shop: job.shop, offset: (job.offset + w), unitsPerWeek: job.unitsPerWeek, emps: job.emps })
      }
    })

    let filtered = all_data.filter(d => state[d.shop]);
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
    setJobs(new_data);
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const convertDaysToMilliseconds = (days) => {
    return days * 24 * 60 * 60 * 1000;
  }

  const convertMillisecondsToDays = (ms) => {
    return Math.ceil( ms / (24 * 60 * 60 * 1000) );
  }

  const convertToDate = (value) => {
    let date = (value * 7) + convertMillisecondsToDays(new Date('7/1/2021').getTime());
    date = new Date(convertDaysToMilliseconds(date));
    return date.toLocaleDateString();
  }

  const shopSwitches = shops.map(shop => (
      <Grid item>
        <FormControlLabel
          key={shop}
          control={
            <Switch 
              name={shop} 
              id={shop}
              color="primary"
              // size="small"
              checked={state[shop]} 
              onChange={handleChange} 
            />
          }
          label={shop}
        />
      </Grid>
  ))

  return (
    <div>
      <Grid container direction="row" style={{width: '100%'}}>
        <Grid item style={{width: '10vw'}}>
          {/* <Paper elevation={10}> */}
            <FormGroup column style={{marginTop: '50px', padding: '10px'}}>
              <Typography>
                SHOPS
              </Typography> 
              {shopSwitches}
            </FormGroup>
          {/* </Paper> */}
        </Grid>
        <Grid item style={{width: '80vw'}}>
          <Chart
            // palette=""
            dataSource={jobs}
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
    </div>
  );
}

export default Graph;