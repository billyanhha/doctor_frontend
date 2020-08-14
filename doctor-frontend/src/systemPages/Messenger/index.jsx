import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import "./style.css"
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MessChatList from './components/MessChatList';
// import MessSearch from './components/MessSearch';
import Chat from './components/Chat';
import _ from "lodash"
import { useDispatch } from 'react-redux';

const Messenger = () => {

    const [search, setsearch] = useState(false);
    const [searchText, setsearchText] = useState('');

    const dispatch = useDispatch()

    const closeSearch = () => {
        setsearch(false)
        setsearchText('')
    }

    // const onSearchChange = _.debounce((value) => {
    //     const trimValue = value.trim();
    //     let query = { query: trimValue, page: 1 }
    //     dispatch(queryDoctor(query));
    // }, 300)

    // const onSerchDebounce = (e) => {
    //     setsearchText(e?.target?.value?.trim())
    //     onSearchChange(e?.target?.value?.trim())
    // }


    return (
        <div>
            <Navbar />
            <div className="messenger">
                <div className="messenger-chatlist">
                    <div className="messenger-chatlist-header">
                        <div>
                            Chats
                        </div>
                        <div>
                            {/* <Input
                                // size="large"
                                onFocus={() => setsearch(true)}
                                onChange={onSerchDebounce}
                                value = {searchText}
                                placeholder="Tìm kiếm bệnh nhân" prefix={<SearchOutlined />}
                                style={{ borderRadius: '15px', marginTop: '20px' }}
                            /> */}
                        </div>
                    </div>
                    <MessChatList />
                    {/* {search ? <MessSearch closeSearch={closeSearch} searchText={searchText} /> : <MessChatList />} */}
                </div>
                <Chat />
            </div>
        </div>
    );
};

export default withRouter(Messenger);