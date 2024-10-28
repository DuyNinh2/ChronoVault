import React, { useState } from 'react';
import '../../styles/admin/ManageSystem.scss';

const ManageSystem = ({ setActiveComponent }) => {
    const [selectedComponent, setSelectedComponent] = useState('product');

    const handleSelect = (component) => {
        setSelectedComponent(component);
        setActiveComponent(component);
    };

    return (
        <div className="admin-manage-system">
            <h2 className='admin-manage-system-h2'>Management System</h2>
            <ul className="management-list">
                <li
                    className={selectedComponent === 'product' ? 'active' : ''}
                    onClick={() => handleSelect('product')}
                >
                    Product Management
                </li>
                <li
                    className={selectedComponent === 'order' ? 'active' : ''}
                    onClick={() => handleSelect('order')}
                >
                    Order Management
                </li>
                <li
                    className={selectedComponent === 'promotion' ? 'active' : ''}
                    onClick={() => handleSelect('promotion')}
                >
                    Promotion Management
                </li>
                <li
                    className={selectedComponent === 'user' ? 'active' : ''}
                    onClick={() => handleSelect('user')}
                >
                    User Management
                </li>
                <li
                    className={selectedComponent === 'statistics' ? 'active' : ''}
                    onClick={() => handleSelect('statistics')}
                >
                    Statistics
                </li>
            </ul>
        </div>
    );
};

export default ManageSystem;
