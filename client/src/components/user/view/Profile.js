import React from 'react';
import {checkLogin, findUserById, findCreatedRestaurants, findSavedRestaurants, findReviewedRestaurants} from '../userService';
import {RestaurantTable} from '../../restaurant/view/restaurantList';
import {
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    Nav,
    Button,
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import NewRestaurant from '../../restaurant/view/newRestaurant'

class UserTable extends React.Component {
    render() {
        return (
            <div>
                <Navbar color="light" light expand="xs">
                    <NavbarBrand href="/restaurants">Cyelp</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            Hi, {this.props.userInfo.username}
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: null,
            userInfo: {},
            isAuthenticated: false,
            userId: null,
            toRenderNewRestaurant: false,
            toRenderCreateSuccess: false
        };
        this.findCreatedRestaurants = this
            .findCreatedRestaurants
            .bind(this);
        this.findSavedRestaurants = this
            .findSavedRestaurants
            .bind(this);
        this.findReviewedRestaurants = this
            .findReviewedRestaurants
            .bind(this);
        this.renderNewRestaurant = this
            .renderNewRestaurant
            .bind(this);
    }

    async componentDidMount() {
        await checkLogin().then((res) => {
            if (res._id !== null) {
                this.setState({isAuthenticated: true, userId: res._id})
            } else {}
        })

        if (this.state.isAuthenticated) {
            console.log("profile 35")
            await findUserById(this.state.userId).then((res) => {
                this.setState({userInfo: res})
            }).catch((err) => {
                console.log("findUserById failure")
            });
        }
    }

    // BUG: this.findCreatedRestaurants vs findCreatedRestaurants? BUG: rerender
    // when restaurants change or need to add lifecycle
    async findCreatedRestaurants() {
        this.setState({toRenderCreateSuccess: false});
        await findCreatedRestaurants(this.state.userInfo._id).then((res) => {
            console.log("find createdrestaurants success!")
            this.setState({restaurants: res.restaurants})
        }).catch((err) => {
            console.log("findCreatedRestaurants failure")
        });
    }

    async findSavedRestaurants() {
        this.setState({toRenderCreateSuccess: false});
        await findSavedRestaurants(this.state.userInfo._id).then((res) => {
            console.log("find savedrestaurants success!")
            this.setState({restaurants: res.restaurants})
            console.log(res.restaurants)
            console.log(this.state.restaurants)
        }).catch((err) => {
            console.log("findSavedRestaurants failure")
        });
    }

    findReviewedRestaurants() {
        this.setState({toRenderCreateSuccess: false});
        findReviewedRestaurants(this.state.userInfo._id).then((res) => {
            console.log("profile 76")
            console.log(res.restaurants)
            this.setState({restaurants: res.restaurants})
        }).catch((err) => {
            console.log("findReviewedRestaurants failure")
        });
    }

    renderNewRestaurant() {
        this.setState({toRenderNewRestaurant: true, restaurants: null})
    }

    render() {
        if (this.state.isAuthenticated) {
            return (
                <div>
                    <UserTable userInfo={this.state.userInfo}/> {/* BUG: create own history instance? */}
                    {/* <Route
                        render={({history}) => (
                        <button
                            onclick={() => {
                            history.push('/user/' + this.state.userInfo.userId + '/newRestaurant')
                        }}>Create New Restaurant</button>
                    )}/> */}
                    {/*<button>*/}
                    {/*<a href="/">Home</a>*/}
                    {/*</button>*/}

                    <Container fluid>
                        <Button onClick={this.renderNewRestaurant}>Create New Restaurants</Button>
                        <Button onClick={this.findCreatedRestaurants}>Get All Created Restaurants</Button>
                        <Button onClick={this.findSavedRestaurants}>Get All Saved Restaurants</Button>
                        <Button onClick={this.findReviewedRestaurants}>Get All Reviewed Restaurants</Button>
                        {/* <button onclick={this.findReviewedRestaurants}>Get All Reviewed Restaurants</button> */}
                        {this.state.restaurants !== null
                            ? <RestaurantTable restaurants={this.state.restaurants}/>
                            : null}
                        {this.state.toRenderNewRestaurant
                            ? <NewRestaurant
                                onSuccess={() => {
                                    this.setState({toRenderNewRestaurant: false, toRenderCreateSuccess: true})
                                }}/>
                            : null}
                        {this.state.toRenderCreateSuccess
                            ? <div>Create success!</div>
                            : null}

                    </Container>
                </div>
            );
        } else {
            return (
                <div>
                    Please log in
                </div>
            )

        }
    }
}
