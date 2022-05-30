import { NextPage } from 'next';
import styles from '../../styles/Home.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';

interface Ichild {
    keyData: any;
    childData: string[];
    list: Category[];
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

const Child: NextPage<Ichild> = ({ childData, keyData, list }) => {
    const [row, setRow] = useState<number | undefined>();
    return (
        <ul key={keyData} className={`${styles.dropdownmenu} ${styles.nestedMenu} `}>
            {childData.map((res: any, key: number) => {
                const child: any = list.filter((resChild: any) => resChild.isActive === true && resChild.parent.uid === res.uid)
                return (<li
                    className={`${res.parents.length > 0 && styles.dropdownSubmenu
                        } ${row === key && styles.active}`} key={key}
                    onClick={() => setRow(key)}>
                    {res.name}
                    {child.length > 0 && (
                        <>
                            <ArrowForwardIosIcon sx={{ float: 'right' }} />
                            {row === key ? (
                                <ul
                                    key={key}
                                    className={`${styles.dropdownmenu} ${styles.nestedMenu} `}
                                >
                                    {child.map((res: ParentCategory, key: number) => {
                                        return <li key={key}>{res.name}</li>;
                                    })}
                                </ul>
                            ) : (
                                <></>
                            )}
                        </>)}
                </li>);
            })}
        </ul>
    );
};
export default Child;
