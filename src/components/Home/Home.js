import React, { useState, useEffect } from 'react'
import {
	Container,
	Grow,
	Grid,
	Paper,
	AppBar,
	TextField,
	Button,
} from '@material-ui/core'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import ChipInput from 'material-ui-chip-input'
import { useHistory, useLocation } from 'react-router-dom'
import { getPosts, getPostsBySearch } from '../../actions/posts'
import { useDispatch } from 'react-redux'
import Pagination from '../Pagination'
import useStyles from './styles'

function useQuery() {
	return new URLSearchParams(useLocation().search)
}

const Home = () => {
	// UTILS
	const dispatch = useDispatch()
	const query = useQuery()
	const history = useHistory()
	const page = query.get('page') || 1
	const searchQuery = query.get('searchQuery')
	const classes = useStyles()
	// States
	const [currentId, setCurrentId] = useState(null)
	const [search, setSearch] = useState('')
	const [tags, setTags] = useState([])

	// FUNCTIONS
	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			searchPost()
		}
	}
	const handleAddTags = (tag) => setTags([...tags, tag])
	const handleDeleteTags = (tagToDelete) =>
		setTags(tags.filter((tag) => tag !== tagToDelete))
	const searchPost = () => {
		if (search.trim() || tags) {
			dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
			history.push(
				`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`
			)
		} else {
			history.push('/posts')
		}
	}

	// JSX
	return (
		<Grow in>
			<Container maxWidth='xl'>
				<Grid
					container
					justifyContent='space-between'
					alignItems='stretch'
					spacing={3}
					className={classes.gridContainer}
				>
					<Grid item xs={12} sm={6} md={9}>
						<Posts setCurrentId={setCurrentId} />
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<AppBar
							className={classes.appBarSearch}
							position='static'
							color='inherit'
						>
							<TextField
								name='search'
								variant='outlined'
								label='Search Memories'
								onKeyPress={handleKeyPress}
								fullWidth
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<ChipInput
								style={{ margin: '10px 0' }}
								value={tags}
								onAdd={handleAddTags}
								onDelete={handleDeleteTags}
								label='Search Tags'
								variant='outlined'
							/>
							<Button
								onClick={searchPost}
								className={classes.searchButton}
								color='primary'
								variant='contained'
							>
								Search
							</Button>
						</AppBar>
						<Form currentId={currentId} setCurrentId={setCurrentId} />
						{!searchQuery && !tags.length && (
							<Paper elevation={6} className={classes.pagination}>
								<Pagination page={page} />
							</Paper>
						)}
					</Grid>
				</Grid>
			</Container>
		</Grow>
	)
}

export default Home
