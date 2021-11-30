import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export  class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8, 
        category: 'general',
      }

      static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number, 
        category: PropTypes.string,
      }
      capitalizeFirstLetter = (string)=> {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    constructor(props)
    {
        super(props);
        this.state =
        {
           articles: [],
           loading : false,
           totalResults:0,
           page:1,
        }
        document.title =`${this.props.category} - NewsApp`
    }
    async componentDidMount()
    {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=b13f627284334a268105a31a07cbd91d&pageSize=${this.props.pageSize}`;
       let data =  await fetch(url);
       let parsedData = await data.json();
       console.log(parsedData);
       this.setState({articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading:false
    });

    }
    handlePreviousClick = async()=>
    {
        console.log("Previous");
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=b13f627284334a268105a31a07cbd91d&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
         this.setState({
             loading:true,
         })
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);  
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading:false,
        })
    }
    handleNextClick = async()=>
    {
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults/ this.props.pageSize))){
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=b13f627284334a268105a31a07cbd91d&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;  
            this.setState({
                loading:true,
            })
            let data = await fetch(url);
            let parsedData = await data.json() 
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles,
                loading:false,
            })
    }
    }

    render() {
        return (
            <div className ="container my-3 ">
         
                <h1 className ="text-center" style={{margin: '35px 0px'}}> NewsApp-Top {this.capitalizeFirstLetter(this.props.category)} headlines!</h1> 
                {  this.state.loading && <  Spinner/>}
                < div className = "row">
            {!this.state.loading && this.state.articles.map((element)=>{
                return <div className ="col-md-4" key = {element.url} >
                <NewsItem  title = {element.title} 
                description = {element.description} imageUrl ={element.urlToImage} 
                newsUrl ={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
            })}
                
               </div>
               <div className ="container d-flex justify-content-between">
               <button type="button" disabled ={this.state.page<=1} className="btn btn-dark" onClick ={this.handlePreviousClick}>&larr; previous</button>
               <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/ this.props.pageSize)} className="btn btn-dark" onClick ={this.handleNextClick}>next &rarr;</button>
               </div>
            </div>
        )
    }
}

export default News
