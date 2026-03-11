import React from 'react';
import useAuth from '../hook/useAuth';
import useRole from '../hook/useRole';
import Loading from '../components/Loading/Loading';
import Forbidden from '../components/Forbidden/Forbidden';

const VendorRoute = ({children}) => {
    const {user,loading}=useAuth()
       const {role,roleLoading}=useRole()
        if(loading || !user || roleLoading){
           return <Loading></Loading>
       }
   
       if(role!=='vendor'){
           return <Forbidden></Forbidden>
       }
       return children;
};

export default VendorRoute;