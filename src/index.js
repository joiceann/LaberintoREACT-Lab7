/**************************************
 *      Joice Andrea Miranda
 *      Carnet 15552
 ***************************************/

 /*Referencias
 1. https://reactjs.org/docs/refs-and-the-dom.html
 2. 
 */


import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import './style.css'
import akaneInicio from './assets/akaneInicio.png'
import akaneIzq from './assets/akaneIzq.png'
import ranmaFinal from './assets/ranmaFinal.png'
import juntos from './assets/juntos.png'

const url = 'http://34.210.35.174:3001/?type=json&w=4&h=4'; 

class App extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			data:[],
			pared: [],
			x:0,
			y:0,
			animacion:'der'
		}
	}

	componentDidMount(){
		this.getPared();
		this.render();
	}

	getPared( ){
		axios.get(url)
		.then(res => {
			const data = res.data;
			let restore=[];
			let cont=0;
			for(let fila in data){
				let filas = data[fila]
				for (let caracter in filas){
					let symb=filas[caracter]
					if (symb==='p'){
						this.setState({
							x: caracter,
							y:fila
						})	
					}

					restore.push(symb)
				}
			}
			this.setState({
				pared:restore,
				data:data
			})
		})

		console.log('termina de obtener pared')
	}

	moving (action, oldX, oldY){
		console.log('metodo moving')
		console.log(action)
		console.log('viejo y '+oldY)
		console.log('viejo x '+oldX)
		let restore=[];
		let newX=oldX;
		let newY=oldY;

		if (action==="arriba"){
			newY=parseInt(oldY)-1
		}
		else if (action==="abajo"){
			newY=parseInt(oldY)+1
		}
		else if (action==="derecha"){
			newX=parseInt(oldX)+1
			this.setState({
				animacion:'der'
			})
		}
		else if (action==="izquierda"){
			newX=parseInt(oldX)-1
			this.setState({
				animacion:'izq'
			})
		}
		console.log('nuevo x '+newX)
		console.log('nuevo y '+newY)

		let data = this.state.data
		let actual=data[oldY][oldX]
		let futuro= data [newY][newX] 
		console.log('futuro '+ futuro)
		if (futuro===' '){
			data[oldY][oldX]=' '
			data [newY][newX]='p'

			//actualiza
			for(let fila in data){
				let filas = data[fila]
				for (let caracter in filas){
					let symb=filas[caracter]
					if (symb==='p'){
						this.setState({
							x: caracter,
							y:fila
						})	
					}
					restore.push(symb)
				}
			}
			this.setState({
				pared:restore,
				data:data
			})
		}
		else if (futuro==='g' ){
			data[oldY][oldX]=' '
			data [newY][newX]='p'

			//actualiza
			for(let fila in data){
				let filas = data[fila]
				for (let caracter in filas){
					let symb=filas[caracter]
					if (symb==='p'){
						this.setState({
							x: caracter,
							y:fila
						})	
					}
					restore.push(symb)
				}
			}
			this.setState({
				pared:restore,
				data:data,
				animacion:'gana'
			})
		}
	}

	render(){
		return(
			<div className='App'>
				<Header/>
				<div className='laberinto'>
				{
					this.state.pared
					.map((bloque,index)=>{
						if (bloque==="p"){
							return(
								<Personaje animacion={this.state.animacion} posX={this.state.x} posY={this.state.y} moving={this.moving.bind(this)}/>
							)
						}
						else if(bloque==='g'){
							return(
								<div className='bloqueIndividuo'> 
									<img src={ranmaFinal}/>
								</div>
							)
						}
						else if (bloque===" "){
							return(
								<div className='bloqueBlanco'> </div>
							)
						}
						else{
							return(
								<div className='bloque'> </div>
							)
						}
					})
				}
			</div>
			</div>
		);
	}
}

class Header extends React.Component{
    render(){
		return(
			<div>
				<header>
				<div className='titulo'>
					Laberinto
				</div>
			</header>
			</div>
		);
	}
}


class Personaje extends React.Component{
	constructor(props){
		super(props)
		this.play = React.createRef();
		this.state=({
			x:props.posX,
			y:props.posY
		})
	}
	componentDidMount() {
		this.play.current.focus();
	}
	teclazo (e) {
		let code = e.keyCode ? e.keyCode : e.which;
		if (code === 38) { 
			this.props.moving('arriba', this.state.x, this.state.y)
		} else if (code === 40) { 
			this.props.moving('abajo', this.state.x, this.state.y)
		} 
		else if (code === 39) {
			this.props.moving('derecha', this.state.x, this.state.y)
		} 
		else if (code === 37) {
			this.props.moving('izquierda', this.state.x, this.state.y)
		}
	}
	render(){
		if (this.props.animacion==='der'){
			return(
				<div className='bloqueIndividuo' onKeyDown={this.teclazo.bind(this)} tabIndex="0" ref={this.play} > 
					<img src={akaneInicio}/>
				</div>
			)
		}
		else if (this.props.animacion==='gana'){
			return(
				<div className='bloqueIndividuo' onKeyDown={this.teclazo.bind(this)} tabIndex="0" ref={this.play} > 
					<img src={juntos}/>
				</div>
			)
		}
		else{
			return(
				<div className='bloqueIndividuo' onKeyDown={this.teclazo.bind(this)} tabIndex="0" ref={this.play} > 
					<img src={akaneIzq}/>
				</div>
			)
		}
	}
}

ReactDOM.render( <App/>, document.getElementById('index'))