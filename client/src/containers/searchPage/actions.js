import { apiUrl } from 'Config';
import axios from 'axios';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';



const getRecordsSuccess = (records) => {
    return {
        type: "GET_RECORDS_SUCCESS",
        records
    }
}

export const searchFieldChange = (value) => {
    return {
        type: "SEARCH_FIELD_CHANGE",
        value
    }
}

export const recordCellChange = (value, recordId, propertyName) => {
    return {
        type: "RECORD_CELL_CHANGE",
        value,
        recordId,
        propertyName
    }
}

export const insertRecord = (record) => (dispatch) => {
    dispatch({ type: "INSERT_RECORD_REQUEST" });

    axios.post('insert', record)
        .then(response => {
            dispatch({
                type: "INSERT_RECORD_SUCCESS",
                record: response.data
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: "INSERT_RECORD_ERROR", error: error.message });
        })

}

export const deleteRecord = (recordId) => (dispatch) => {
    dispatch({ type: "DELETE_RECORD_REQUEST" });

    axios.delete('delete/' + recordId)
        .then(response => {
            dispatch({
                type: "DELETE_RECORD_SUCCESS",
                recordId
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: "DELETE_RECORD_ERROR", error: error.message });
        })
}

export const getAllRecords = () => (dispatch) => {
    dispatch({ type: "GET_ALL_RECORDS_REQUEST" });

    axios.get('xsdb')
        .then(response => {
            dispatch(getRecordsSuccess(response.data));
        })
        .catch(error => {
            dispatch({ type: "GET_ALL_RECORDS_ERROR", error: error.message });
        })
}

export const getFilteredRecords = (query) => (dispatch) => {
    const params = getQueryObject(query);

    dispatch({ type: "GET_FILTERED_RECORDS_REQUEST" });

    axios.post('search', params)
        .then(response => {
            dispatch(getRecordsSuccess(response.data))
        })
        .catch(error => console.log(error))
}


function getQueryObject(query = "") {
    const _and = ",", _or = "|", _assing = "=";

    query = query.replace(/\s/g, "");

    const pairs = query.split(_and);
    const conditions = {};

    pairs.map(pair => {
        const pp = pair.split(_assing);
        conditions[pp[0]] = pp[1];
    })

    return conditions;
}