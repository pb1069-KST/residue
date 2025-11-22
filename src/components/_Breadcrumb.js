import React, { Component } from "react";
import "antd/dist/antd.css";

import { Breadcrumb, } from "antd";

class _Breadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }
    
    render() {
        return (
            <Breadcrumb style={{fontSize:"12px", fontWeight:"600"}}>
            {this.props.datasource_breadcrumb.map((data,idx)=>{
                return(
                    <Breadcrumb.Item key={idx}>
                        <a style={{ color: "black" }} href={data.href}>{data.name}</a>
                    </Breadcrumb.Item>
                )
            })}
            </Breadcrumb>
        );
    }
}

export default _Breadcrumb;
