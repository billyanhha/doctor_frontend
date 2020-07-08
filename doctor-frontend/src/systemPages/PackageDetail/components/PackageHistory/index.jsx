import React, { useEffect } from 'react';
import "./style.css";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getPackageStatus } from '../../../../redux/package';
import moment from "moment"

const PackageHistory = (props) => {

    const { isLoad } = useSelector(state => state.ui)
    const { packageData } = useSelector(state => state.package)

    useEffect(() => {


    }, []);

    const renderTimeline = packageData.status?.map((value, index) => {
        return (
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: '#F2F7FA', color: '#448AFF' }}
                contentArrowStyle={{ borderRight: '7px solid  #448AFF' }}
                date={moment(value?.created_at).format('DD - MM - YYYY [lúc] HH [giờ] mm [phút]')}
                iconStyle={{ background: '#448AFF', color: '#fff' }}
            >
                <p>
                    {value?.status_name}
                </p>
                <h4>{value?.note ? `Ghi chú : ${value?.note} ` : ''}</h4>
            </VerticalTimelineElement>
        )
    })
    return (
        <Spin size="large" spinning={isLoad}  >
            <div>
                <VerticalTimeline className="vertical-timeline vertical-timeline-custom-line" >
                    {renderTimeline}
                </VerticalTimeline>
            </div>
        </Spin>
    );
};

export default PackageHistory;