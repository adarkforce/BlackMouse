
import * as React from 'react';
import { Container, Header, Left, Body, Right, Icon, Title } from 'native-base';

function MyHeader({leftIcon,rightIcon,title}) {
    return (
        <Header>
            <Left>
                {leftIcon}
            </Left>
            <Body>
                <Title>{title}</Title>
            </Body>
            <Right>
                {rightIcon}
            </Right>
        </Header>
    )
}

export default MyHeader;