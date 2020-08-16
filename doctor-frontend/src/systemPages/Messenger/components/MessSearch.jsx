import React, { useEffect, useState } from 'react';
import "../style.css"
import { Avatar } from 'react-chat-elements'
import { useDispatch, useSelector } from 'react-redux';
import { getUserRelateDoctor } from '../../../redux/chat';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MessSearch = (props) => {

    const dispatch = useDispatch();
    const { userRelateDoctor } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);
    const {currentDoctor} = useSelector(state => state.doctor);


    useEffect(() => {

        if(currentDoctor?.id){
            dispatch(getUserRelateDoctor({ doctor_id: currentDoctor?.id }))
        }

    }, [currentDoctor]);



    const openChatThread = (value) => {
        props.history.push("/messenger/" + value?.customer_id + "?name=" + value?.fullname + "&avatar=" + value?.avatarurl)
    }

    const renderCurrentCustomer =(userRelateDoctor?.map((value, index) => {
        return (
            <div
                style={{ backgroundColor: `${(props.match.params.id === value?.customer_id) ? '#f2f2f2' : ''}` }}
                onClick={() => openChatThread(value)}
                key={value?.customer_id} className="mess-search-currentdoctor">
                <Avatar
                    src={value?.avatarurl}
                    alt={value?.fullname}
                    size="large"
                    type="circle flexible" />
                <div className="mess-search-currentdoctor-info">
                    <div className="mess-search-currentdoctor-info-big">
                        {value?.fullname}
                    </div>
                    <div className="mess-search-currentdoctor-info-small">
                        {value?.phone} - {value?.address}
                    </div>
                </div>
            </div>
        )
    }))


    return (
        <div className="mess-search">
            <div className="mess-search-currentdoctor-list">
                <Button onClick={props.closeSearch} style={{ margin: 0, padding: 0 }} type="link" icon={<ArrowLeftOutlined />} >Quay lại</Button>
                <br /><br />
                <h3>Bệnh nhân của bạn</h3>
                <Spin indicator={antIcon} spinning={isLoad}>
                    {renderCurrentCustomer}
                </Spin>
            </div>
            {/* {props.searchText ? (

                <div>
                    <h4>Kết quả tìm kiếm cho "{props.searchText}"</h4>
                    {renderSearchDoctor}
                    <Button
                        loading={disable || isLoad}
                        style={{ display: `${doctor?.isOutOfData ? 'none' : ''}` }}
                        type="link" onClick={getMoreData} >Tải thêm</Button>                </div>

            ) : ''} */}
        </div>
    );
};

export default withRouter(MessSearch);