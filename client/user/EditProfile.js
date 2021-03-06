import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent } from '@mui/material';
import { Button, TextField, Icon } from '@mui/material';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import auth from './../auth/auth-helper';
import { read, update } from './api-user';
import { useNavigate, useParams, Navigate } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 500,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(3),
        paddingButton: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginButtom: theme.spacing(2)
    }
}));

export default function EditProfile() {

    // const Navigate = useNavigate()
    const { userId } = useParams()
    const classes = useStyles()
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        error: '',
        redirectToProfile: '',
    })

    const jwt = auth.isAuthenticated();

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            userId: userId,
        },
            { t: jwt.token }, signal).then((data) => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({ ...values, name: data.name, email: data.email })
                }
            })
        return function cleanup() {
            abortController.abort()
        }
    }, [userId])

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }

        update({
            userId: userId
        }, { t: jwt.token }, user).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, userId: data._id, redirectToProfile: true })
            }
        })
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    if (values.redirectToProfile) {
        return (<Navigate to={`/user/${values.userId}`} />)
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography varaint="h6" className={classes.title}>
                    EditProfile
                </Typography>
                <TextField id="name" label="Name" className={classes.textField} onChange={handleChange('name')} margin="normal" /><br />
                <TextField id="email" label="Email" className={classes.textField} onChange={handleChange('email')} margin="normal" /><br />
                <TextField id="password" type="password" label="Password" className={classes.textField} onChange={handleChange('password')} margin="normal" />
                <br />
                {
                    values.error && (<Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {values.error}
                    </Typography>)
                }
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Update Profile</Button>
            </CardActions>
        </Card>
    )
}