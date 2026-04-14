import React from 'react'
import styled from 'styled-components'
import { dateFormat } from '../../utils/dateFormat';
import { 
    bitcoin, book, calender, card, circle, clothing, 
    comment, food, freelance, medical, money, piggy, 
    stocks, takeaway, trash, tv, users, yt 
} from '../../utils/Icons';
import Button from '../Button/Button';

function IncomeItem({
    _id,
    title,
    amount,
    date,
    category,
    description,
    deleteItem,
    indicatorColor,
    type
}) {

    const categoryIcon = () => {
        switch(category) {
            case 'salary': return money;
            case 'freelancing': return freelance;
            case 'investments': return stocks;
            case 'stocks': return users;
            case 'bitcoin': return bitcoin;
            case 'bank': return card;
            case 'youtube': return yt;
            case 'other': return piggy;
            default: return '';
        }
    }

    const expenseCatIcon = () => {
        switch (category) {
            case 'education': return book;
            case 'groceries': return food;
            case 'health': return medical;
            case 'subscriptions': return tv;
            case 'takeaways': return takeaway;
            case 'clothing': return clothing;
            case 'travelling': return freelance;
            case 'other': return circle;
            default: return '';
        }
    }

    return (
        /* Use $indicator (transient prop) to prevent it from leaking to the DOM */
        <IncomeItemStyled $indicator={indicatorColor}>
            <div className="icon">
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{title}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>₹ {amount}</p>
                        <p>{calender} {dateFormat(date)}</p>
                        <p>
                            {comment}
                            {description}
                        </p>
                    </div>
                    <div className="btn-con">
                        <Button 
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--primary-color)'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteItem(_id)}
                        />
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    )
}

const IncomeItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;

    .icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        flex-shrink: 0; /* Ensures icon stays circular/square on resize */

        i {
            font-size: 2.6rem;
        }
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        h5 {
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
                /* Access the transient prop $indicator */
                background: ${props => props.$indicator};
            }
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            
            .text {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-wrap: wrap; /* Wraps text if description is long */

                p {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
            }
        }
    }

    /* 📱 Tablet (Max-width: 1024px) */
    @media screen and (max-width: 1024px) {
        .content .inner-content .text {
            gap: 1rem;
        }
    }

    /* 📱 Mobile (Max-width: 600px) */
    @media screen and (max-width: 600px) {
        padding: 0.8rem;
        align-items: flex-start;

        .icon {
            width: 60px;
            height: 60px;
            border-radius: 15px;
            i { font-size: 1.8rem; }
        }

        .content {
            h5 { font-size: 1.1rem; }
            
            .inner-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;

                .text {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .btn-con {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
`;

export default IncomeItem;