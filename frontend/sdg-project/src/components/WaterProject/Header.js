import React, { useState, useEffect } from 'react';
import styled from 'styled-components'


const HeaderWrapper = styled.div`
padding: 73px 100px 40px 73px;
backgroud: #fff;
box-shadow: 0px 4px 8px #A4B4C1;
`

const HeaderTopWrapper = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
color: #51687B;
margin-bottom: 23px;
`

const HeaderBottomWrapper = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

const TitleWrapper = styled.div`
display: flex;
flex-direction: row;

margin-bottom:20px;
`

const Title = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 300;
font-size: 32px;
line-height: 32px;
color: #000000;
margin-bottom: 23px;
`

const Desc = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 300;
font-size: 16px;
line-height: 19px;
display: flex;
align-items: center;

color: #51687B;
width: 921px;
`

const PictureWrapper = styled.div`

`

const PicTitle = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 17px;
line-height: 20px;
color: #0F1F19;
width: 119px;
height: 28px;
letterSpacing: 0.04em;
`

const PicWrapper = styled.div``

const StatusWrapper = styled.div`
width: 129px;
height: 59px;
background: #08253D;
border-radius: 6px;
text-align: center;
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 21px;
display: flex;
align-items: center;
text-align: center;
letter-spacing: 0.04em;
justify-content: center;
color: #FFFFFF;
margin-left: 40px;
`

function getfiscalYear() {
  return new Date().getFullYear()-1;
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state ={

    }
}

  render() {
    var project = this.props.project;
    var sdgList   = [];
    var status = "";
    if(this.props.project.sdgs != undefined) {
      sdgList = project.sdgs;
    }
    if(this.props.status != undefined) {
          status = this.props.status;
        }
    
    return (
      <HeaderWrapper>
    
    <HeaderBottomWrapper>
      <div>
      <TitleWrapper>
        <Title>{project.name}</Title>
        <StatusWrapper>
        
        {status}
        
        
      </StatusWrapper>
        </TitleWrapper>
        <Desc>
          
          {project.description}
        </Desc>
        </div>

      <PictureWrapper>
        <PicTitle>Aligned SDGs</PicTitle>
        <PicWrapper>
          {sdgList.map((sdg) =>{
            if(sdg <= 9) {
                sdg = "0"+sdg
            }
            return <img width="52" height="52" className="tabDescImg" src={require(`../../static/icons/sdgs/E-WEB-Goal-${sdg}.png`)} alt='sdg8' />

            })
          }
        </PicWrapper>
      </PictureWrapper>
    </HeaderBottomWrapper>
  </HeaderWrapper>

    )
  }
}

export default Header;