import React, { useState } from 'react';
import right from '../../static/icons/right.svg';
import './Menu.css'

const menus = [
  {
    title: 'Investor Portal',
    path: '/investor'
  },
  {
    title: 'About Impact Green',
    path: '/about',
    children: [{}]
  },
  {
    title: 'Resources',
    path: '/resources',
    children: [{}]
  },
  
]

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      hash :'',
      curentMenu: '/investor'
    }
    this.goOtherPage = this.goOtherPage.bind(this)
  }

  goOtherPage(path) {
    switch (path) {
      case '/investor':
        this.setState({hash : `/`, curentMenu: path})
        window.location.href = `${window.location.origin}/`
        break;
    }

  }
  
  render () {
    var self = this;
  return (
    <div className="menu">
      <div className="menu-inner">
        {
          menus.map(menu => {
            return <div key={menu.path} className={`menu-item ${this.state.curentMenu === menu.path && 'menu-item-active'} `}
            onClick={()=>self.goOtherPage(menu.path)}>
              <p>{menu.title}</p>
              {menu.children && menu.children.length && <img src={right} className="menu-item-img" alt="right" />}


            </div>
          })
        }

      </div>
    </div>
  );
}
}

export default Menu;