import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Modal,
  TextField,
} from '@mui/material';
import { NextPage } from 'next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import {
  useCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '../src/generated/graphql';
import { useAppDispatch } from '../store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Dispatch } from 'redux';
import { setCategoryList, addCategoryList, updateCategoryList } from '../store/reducer';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
type ParentCategory = {
  __typename: string;
  name: string;
  uid: string;
};
interface Category {
  createdAt: string;
  inActiveNote: null;
  isActive: boolean;
  name: string;
  parent: ParentCategory;
  parents: ParentCategory[];
  uid: String;
  updatedAt: String;
  __typename: String;
}
const actionDispatch = (dispatch: Dispatch) => ({
  setCategoryList: (page: any) => dispatch(setCategoryList(page)),
});
const addActionDispatch = (dispatch: Dispatch) => ({
  addCategoryList: (page: any) => dispatch(addCategoryList(page)),
});
const updateActionDispatch = (dispatch: Dispatch) => ({
  updateCategoryList: (page: any) => dispatch(updateCategoryList(page)),
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface Iform {
  parent: string | null;
  name: string;
}
interface FormErrors {
  [K: string]: string[];
}
const Category: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<Iform>({ parent: null, name: '' });
  const [id, setId] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [category, setCategory] = useState<Array<object>>([]);
  const { setCategoryList } = actionDispatch(useAppDispatch());
  const { addCategoryList } = addActionDispatch(useAppDispatch());
  const { updateCategoryList } = updateActionDispatch(useAppDispatch());
  const getData = useSelector((state: RootState) => state.category.data);

  const { data, error, loading } = useCategoryListQuery();
  const [createCategoryMutation] = useCreateCategoryMutation();
  const [updateCategoryMutation] = useUpdateCategoryMutation();

  const fetchData = () => {
    setCategoryList(data?.getCategories?.result);
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  useEffect(() => {
    setCategory(getData?.categories);
  }, [getData]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }
  const saveCategory = async () => {
    if(id === ''){
    const saveData: any = await createCategoryMutation({
      variables: { category: formValue },
    });
    if (saveData.data.createCategory.message === 'SUCCESS') {
      addCategoryList(saveData.data.createCategory.result);
      setSuccess(true);
      setTimeout(()=>{
        setSuccess(false);
        setFormValue({parent: null, name: '' });
        setOpen(false);
      },800)
    }
  }else{
    const saveData: any = await updateCategoryMutation({
      variables: { category:{name:formValue.name},categoryUid:id },
    });
    if (saveData.data.updateCategory.message === 'SUCCESS') {
      updateCategoryList(saveData.data.updateCategory.result);
      setSuccess(true);
      setTimeout(()=>{
        setSuccess(false);
        setFormValue({parent: null, name: '' });
        setOpen(false);
      },800)
    }
    }    
  };
  const parent: any = formValue?.parent === 'root' ? null : formValue?.parent;
  return (
    <>
      <head>
        <title>Category List</title>
      </head>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <h2>Category List</h2>
        <Button
          variant="contained"
          sx={{ mb: 2, float: 'right' }}
          onClick={() => {
            setOpen(true);
            setFormValue({ parent: null, name: '' });
          }}
        >
          Add Category
        </Button>

        <TableContainer component={Paper}>
          <Table
            sx={{ m: 1 }}
            aria-label="simple table"
            style={{ marginTop: '10px' }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category
                ?.filter((res: any) => res.isActive === true)
                .map((row: any, key: number) => {
                  return (
                    <TableRow
                      key={key}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        <CreateIcon
                          onClick={() => {
                            setFormValue({
                              parent: row.parent?.name,
                              name: row.name,
                            });
                            setOpen(true);
                            setId(row.uid)
                          }}
                        />
                        {/* <DeleteIcon /> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Books
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
          }}
        >
          <Box component="form" sx={style} noValidate autoComplete="off">
            {success && <Alert severity="success">Successfully Updated</Alert>}
            <div>
              <Autocomplete
                options={category}
                getOptionLabel={(option: any) => option?.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Parent"
                    variant="standard"
                  />
                )}
                onChange={(event, newValue: any) => {
                  setFormValue({ ...formValue, parent: newValue?.uid });
                }}
                // value={''}
                inputValue={parent}
              />
              <TextField
                id="outlined-helperText"
                label="Category"
                helperText="For Subcategory please select parant "
                value={formValue.name}
                onChange={(event: any) => {
                  setFormValue({ ...formValue, name: event.target.value });
                }}
              />
              <Button
                variant="contained"
                sx={{ mb: 2, float: 'right' }}
                onClick={() => saveCategory()}
              >
                Save
              </Button>
            </div>
          </Box>
        </Modal>
      </Container>
    </>
  );
};
export default Category;
