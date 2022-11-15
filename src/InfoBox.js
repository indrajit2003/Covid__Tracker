import React from 'react'
import {Card,CardContent,Typography} from '@mui/material';
import './infoBox.css';

const InfoBox = ({title,cases,total,...props}) => {
  return (
    <div>
        <Card onClick={props.onClick} className='infoBox'>
          
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title} </Typography>


                <h2 className='infoBox__cases'>{cases}</h2>

                <Typography className="infoBox__total" color="textSecondary" > total {total} </Typography>
                    
               
            </CardContent>
        </Card>
    </div>
  )
}

export default InfoBox
