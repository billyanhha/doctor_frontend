import React, { useEffect } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css'; import { Badge } from 'antd';
import { AppstoreAddOutlined, ProfileOutlined, FolderAddOutlined, MessageOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadGroup } from '../../redux/chat';

const FloatingButton = (props) => {

    const dispatch = useDispatch();
    const { currentDoctor } = useSelector(state => state.doctor);
    const { nonReadGroupNumber } = useSelector(state => state.chat);

    useEffect(() => {
        
        if(currentDoctor?.id){
            dispatch(getUnreadGroup({ id: currentDoctor?.id }))
        }

    }, [currentDoctor]);

    const toMessenger = () => {
        props.history.push("/messenger/t")
    }


    return props.location.pathname.includes('/messenger') ? '' : (
        <Fab
            // mainButtonStyles={mainButtonStyles}
            // actionButtonStyles={actionButtonStyles}
            mainButtonStyles={{ backgroundColor: '#fff', border: '1px solid #00BC9A' }}
            icon={
                <Badge count={nonReadGroupNumber}>
                    <MessageOutlined style={{ fontSize: '23px', color: '#00BC9A' }} />
                </Badge>}
            text={<p>Tin nhắn <br /> {nonReadGroupNumber} tin nhắn mới</p>}
            onClick={toMessenger}
        >
        </Fab>
    );
};

export default withRouter(FloatingButton);