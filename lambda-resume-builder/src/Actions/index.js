import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import axioken, { handleError } from '../Utilities'

const REQUEST = 'REQUEST',
	SUCCESS = 'SUCCESS',
	GETJOBS = 'GETJOBS'

const url = 'https://lambda-crp.herokuapp.com/graphql'

const register = (user, bool) => dispatch => {

	dispatch({ type: REQUEST })

	axios.post(url, {
		query: `
      mutation{
        createUser(userInput: {
          email:"${user.email}",
          password:"${user.password}",
          role: "${bool ? 'Admin' : 'Student'}"
        }){
          _id
          token
          tokenExp
        }
	  }
	  `
	})
		.then(res => {
			console.log('REGISTERED', res)
			const token = res.data.data.createUser.token
			Cookies.set('token', token)
			dispatch({ type: SUCCESS, payload: res.data })
			if (jwt_decode(token).role === "Admin") window.location.pathname = '/admin/dashboard'
			else if (token) window.location.pathname = '/dashboard/profile'
		})
		.catch(err => handleError(err))
}

const login = (creds) => dispatch => {

	dispatch({ type: REQUEST })

	axios.post(url, {
		query: `
      query{
        login(email:"${creds.email}", password:"${creds.password}"){
          token
        }
	  }
	  `
	})
		.then(res => {
			console.log('second response', res)
			const { token } = res.data.data.login
			Cookies.set('token', token)
			Cookies.set('creds', JSON.stringify(creds))
			const admin = jwt_decode(token)
			console.log('admin', admin)
			const location = Cookies.get('location')
			dispatch({ type: SUCCESS, payload: token })
			window.location.pathname = `${
				token &&
					location ? location
					:
					jwt_decode(token).role === "Admin" ?
						'/admin/dashboard'
						:
						'/dashboard/profile'
				}`
		})
		.catch(err => handleError(err))
}

const createGoogleUser = google => dispatch => {
	axios.post(url, {
		query: `
      mutation{
        createGoogleUser(googleData: {
          token: "${google.token}", 
          image: "${google.image}", 
          email: "${google.email}", 
          name: "${google.name}", 
          password: "${google.password}"
        }){
          _id
          token
          tokenExp
        }
	  }
	  `
	})
		.then(res => {
			console.log('second response', res)
			const { token } = res.data.data.createGoogleUser
			Cookies.set('token', token)
			dispatch({ type: SUCCESS, payload: token })
			if (token) {
				window.location.pathname = '/dashboard/profile'
			}
		})
		.catch(err => handleError(err))
}

const getJobs = () => dispatch => {

	axioken().post(url, {
		query: `
        {
          jobs{
			_id
            company
            position
            location
            applied
            interview
            offer
          }
        }
        `
	})
		.then(res => dispatch({ type: GETJOBS, payload: res.data.data.jobs }))
		.catch(err => handleError(err))

}

const addJob = job => dispatch => {

	axioken().post(url, {
		query: `
        mutation{
          addJob(jobInput: {
            company: "${job.company}",
            position: "${job.position}",
            location: "${job.location}",
            applied: ${job.applied},
            interview: ${job.interview},
            offer: ${job.offer}
          }){
            _id
          }
        }
        `
	})
		.then(() => getJobs())
		.catch(err => handleError(err))

}

const updateJob = job => dispatch => {

	axioken().post(url, {
		query: `
		mutation{
			updateJob(upJob: {
				_id: "${job._id}",
				company: "${job.company}",
				position: "${job.position}",
				location: "${job.location}",
				applied: ${job.applied},
				interview: ${job.interview},
				offer: ${job.offer}
			}){
				_id
			}
		}
		`
	})
		.then(() => getJobs())
		.catch(err => handleError(err))

}

const delJob = id => dispatch => {

	axioken().post(url, {
		query: `
		mutation{
			delJob(_id: "${id}"){
				_id
				company
				position
				location
				applied
				interview
				offer
			}
		}
		`
	})
		.then(res => dispatch({ type: GETJOBS, payload: res.data.data.delJob }))
		.catch(err => handleError(err))

}

export {
	REQUEST,
	SUCCESS,
	GETJOBS,
	register,
	login,
	createGoogleUser,
	getJobs,
	addJob,
	updateJob,
	delJob
}
