import React, { useState } from 'react';
import "./style.css"
import { Tag, Button, Popconfirm } from 'antd';
import priorityData from "../../../../configs/prioritiy"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import Modal from 'antd/lib/modal/Modal';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ServiceForm from './form/ServiceForm';
import { deleteServicePackage } from '../../../../redux/package';

// #EC6150
const Service = (props) => {

    const { packageData } = useSelector(state => state.package)
    const dispatch = useDispatch();
    const [visible, setvisible] = useState(false);
    const [serviceModalVisible, setserviceModalVisible] = useState(false);
    const [service, setservice] = useState(null);
    const [editMode, seteditMode] = useState(false);

    // useEffect(() => {



    // }, [deleteServicePackageSuccess]);

    const renderData = service && (
        <div className={"package-service-description"}
            style={{ borderLeft: `10px solid ${priorityData?.[`${service?.priority}`].color}` }}
        >

            <p style={{ color: `${priorityData?.[`${service?.priority}`].color}` }}> {service?.name} </p>
                    Mức độ ưu tiên  <span style={{ color: `${priorityData?.[`${service?.priority}`].color}` }}>
                - {service?.priority} ({priorityData?.[`${service?.priority}`].class})
                    </span>
            <br />
            <div className="package-service-description-note">
                * Chú thích :  {service?.description}
            </div>
        </div>
    )

    const showModal = (value) => {

        let newValue = {
            package_service_id: value?.id,
            package_id: value?.package_id,
            id: value?.service_id,
            priority: value?.priority,
            description: value?.description,
            active: value?.active,
            name: value?.name
        }

        seteditMode(false)
        setvisible(true)
        setservice(newValue)
    }

    const showInputServiceModal = () => {
        setserviceModalVisible(true)
    }


    const handleCancel = e => {
        setserviceModalVisible(false)
        setvisible(false)
    };

    const handleEdit = () => {
        seteditMode(true)
    }


    const confirmDelete = (e) => {
        dispatch(deleteServicePackage(service))
        handleCancel()
    }

    const cancel = (e) => {

    }


    const renderServices = packageData?.services?.map((value, index) => {
        return (
            <Tag
                onClick={() => showModal(value)}
                className="service-tag"
                color={priorityData[`${value?.priority}`].color}>{value?.name}</Tag>
        )
    })

    return (
        <div className="package-service">
            <p className="package-service-title">Dịch vụ</p>
            <p className="package-service-small">Bạn sử dụng
            <span className="hightlight"> {packageData?.services?.length} dịch vụ </span>
                trong gói này
            </p>
            <div className="package-service-item">
                {renderServices}
                <Tag className="site-tag-plus" onClick={showInputServiceModal}>
                    <PlusOutlined /> Thêm dịch vụ
                </Tag>
            </div>
            <hr className="line" />
            <Modal
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Quay lại
                    </Button>,
                    <Button key="edit" onClick={handleEdit}>
                        Sửa
                    </Button>,
                    <Popconfirm
                        title="Bạn có chắc chắn không ?"
                        onConfirm={confirmDelete}
                        onCancel={cancel}
                        okText="Chắc chắn"
                        cancelText="Quay lại"
                    >
                        <Button key="delete" type="text" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                ]}
            >
                {editMode ? <ServiceForm close={handleCancel} editMode={editMode} service={service} /> : renderData}
            </Modal>
            <Modal
                title="Thêm dịch vụ"
                visible={serviceModalVisible}
                onCancel={handleCancel}
                footer={[

                ]}
            // onOk={handleOk}
            >
                <ServiceForm close={handleCancel} />
            </Modal>
        </div>
    );
};

export default withRouter(Service);