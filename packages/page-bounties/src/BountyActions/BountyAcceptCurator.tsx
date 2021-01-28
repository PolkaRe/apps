// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useBounties, useUserRole } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  fee: BN;
  index: BountyIndex;
}

function BountyAcceptCurator ({ curatorId, fee, index }: Props) {
  const { t } = useTranslation();
  const { acceptCurator } = useBounties();

  const [isOpen, toggleOpen] = useToggle();

  const { isCurator } = useUserRole(curatorId);
  const { bountyCuratorDeposit } = useBounties();

  const deposit = bountyCuratorDeposit.mul(fee).div(new BN(1000000));

  return isCurator
    ? (
      <>
        <Button
          icon='check'
          isDisabled={false}
          label={t<string>('Accept')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('accept curator')}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{t<string>('This action will accept your candidacy for the curator of the bounty.')}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    help={t<string>('This account will be used to create the accept curator transaction.')}
                    isDisabled
                    label={t<string>('curator account')}
                    type='account'
                    value={curatorId.toString()}
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('Only the account proposed as curator by the council can create the assign curator transaction ')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputBalance
                    defaultValue={fee.toString()}
                    isDisabled
                    label={t<string>("curator's fee")}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('This amount will be sent to your account on bounty claim.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputBalance
                    defaultValue={deposit.toString()}
                    help={t<string>("Curator's deposit depends on bounty fee.")}
                    isDisabled
                    label={t<string>("curator's deposit")}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('This amount will be reserved from your account and returned on bounty claim or if you give up, unless you are slashed earlier.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={curatorId}
                icon='check'
                label={t<string>('Accept Curator')}
                onStart={toggleOpen}
                params={[index]}
                tx={acceptCurator}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(BountyAcceptCurator);
