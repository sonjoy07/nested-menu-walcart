import {
  Autocomplete,
  Box,
  Button,
  Container,
  Modal,
  TextField,
  Typography,
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
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { useCategoryListQuery, useCreateCategoryMutation } from '../src/generated/graphql'
import { useAppDispatch } from '../store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Dispatch } from 'redux';
import { setCategoryList } from '../store/reducer';

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
  parent: string
  category: string
}
interface FormErrors {
  [K: string]: string[];
}
const Category: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<Iform>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [category, setCategory] = useState<Array<object>>([])
  const { setCategoryList } = actionDispatch(useAppDispatch());
  const getData = useSelector((state: RootState) => state.category.data);

  const { data, error, loading } = useCategoryListQuery();  
  const [createCategoryMutation, { data1, loading1, error1 }] = useCreateCategoryMutation();

  const fetchData = () => {
    setCategoryList(data?.getCategories?.result);
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  useEffect(() => {
    setCategory(getData?.categories)
  }, [getData]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }
  const options: any = category?.map((option: any) => option?.name)
  console.log(formValue);
  const saveCategory=()=>{
    createCategoryMutation({ variables: { category: formValue } })
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <h2>Category List</h2>
      <Button
        variant="contained"
        sx={{ mb: 2, float: 'right' }}
        onClick={() => setOpen(true)}
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
            {category?.filter((res: any) => res.isActive === true).map((row: any, key: number) => {
              return (<TableRow
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <CreateIcon />
                  <DeleteIcon />
                </TableCell>
              </TableRow>)
            })}
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Books
              </TableCell>
              <TableCell align="right">
              </TableCell>
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
          <div>
            <Autocomplete
              options={category}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField {...params} label="Select Parent" variant="standard" />
              )}
              onChange={(event, newValue: any) => {
                setFormValue({ ...formValue, parent: newValue.uid });
              }}
            />
            <TextField
              id="outlined-helperText"
              label="Category"
              helperText="For Subcategory please select parant "
              onChange={(event: any) => {
                setFormValue({ ...formValue, name: event.target.value });
              }}
            />
            <Button variant="contained" sx={{ mb: 2, float: 'right' }} onClick={()=>saveCategory()}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
};
export default Category;

