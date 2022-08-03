import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import OutlinedInput from '@mui/material/OutlinedInput';

export default function Test() {
  const [frequency, setFrequency] = useState('');
  const [times, setTimes] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency((event.target as HTMLInputElement).value);
  };

  const handleChangeTimes = (event: any) => {
    const value = event.target.value;
    setTimes(value);
  };
  const handleBlurTimes = (event: any) => {
    const value = event.target.value;
    setTimes(value.replace(/\D/g, ''));
  };
  const handleChangePrice = (event: any) => {
    const value = event.target.value;
    setPrice(value);
  };
  const handleBlurPrice = (event: any) => {
    const value = event.target.value;
    setPrice(value.replace(/\D/g, ''));
  };

  function isNumber(str: string) {
    str = str == null ? '' : str;
    if (str.match(/^\d+$/)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div id="test">
      <h2 className="title">購入</h2>
      <div>
        <h3>頻度</h3>
        <FormControl>
          <RadioGroup value={frequency} onChange={handleChange}>
            <FormControlLabel value="full" control={<Radio />} label="一回購入" />
            <Box>
              <FormControlLabel value="installment" control={<Radio />} label="分割購入" />
              {frequency !== 'installment' ? (
                <></>
              ) : (
                <>
                  <OutlinedInput
                    placeholder="2~48"
                    sx={{ width: 80 }}
                    value={times}
                    onChange={handleChangeTimes}
                    onBlur={handleBlurTimes}
                  />
                  回
                </>
              )}
            </Box>
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <h3>金額</h3>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0.5} alignItems="center">
            <Grid item xs={2}>
              <span>{frequency !== 'installment' ? <> 　　 </> : <> 毎月 </>}</span>
            </Grid>
            <Grid item xs={8}>
              <OutlinedInput
                inputProps={{ style: { textAlign: 'right' } }}
                placeholder="1~9999"
                sx={{ width: '100%' }}
                value={price}
                onChange={handleChangePrice}
                onBlur={handleBlurPrice}
              />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'right' }}>
              0,000円
            </Grid>
          </Grid>
        </Box>
        {frequency !== 'installment' ? (
          <Box sx={{ flexGrow: 1 }} />
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0.5} alignItems="center">
              <Grid item xs={2}>
                総計
              </Grid>
              <Grid item xs={10} sx={{ textAlign: 'right' }}>
                {isNumber(times) && isNumber(price) ? (Number(times) * Number(price) * 10000).toLocaleString() : '- '}円
              </Grid>
            </Grid>
          </Box>
        )}
      </div>
    </div>
  );
}
