import React, { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Spinner from '../../UI/Spinner';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { LoadIndicator } from 'devextreme-react/load-indicator';

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
import { Typography } from '@material-ui/core';

const sources = [
  { value: 'units', name: 'Units' },
  { value: 'emps', name: 'Employees' },
];

const Graph = (props) => {
  const { jobs, allShops, toMS, toDays } = props;
  const [ state, setState ] = React.useState({});
  const [ data, setData ] = useState([]);
  const [ shops, setShops ] = useState([]);
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    let newShops = allShops.map(shop => shop.shop);
    setShops(newShops);
    setLoaded(true);
  }, [])

  useEffect(() => {
    setLoaded(false);
    calculateForOffSets();
    setLoaded(true);
  }, [ state ])

  const calculateForOffSets = () => {
    let all_data = [];
    jobs.forEach(job => {
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
    setData(new_data);
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const convertToDate = (value) => {
    let date = (value * 7) + toDays(new Date().getTime());
    date = new Date(toMS(date));
    return date.toLocaleDateString();
  }

  const shopSwitches = shops.map(shop => (
      <Grid item key={shop}>
        <FormControlLabel
          key={shop}
          control={
            <Switch 
              name={shop} 
              id={shop}
              color="primary"
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
            dataSource={data}
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