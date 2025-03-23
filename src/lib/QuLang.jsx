import { Buffer } from 'buffer'
import base64 from 'base-64'
import { TICK_OFFSET } from "@/contexts/ConfigContext"
import {NextResponse} from "next/server";

export const HEADERS = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
}

export const makeJsonData = (contractIndex, inputType, inputSize, requestData) => {
    return {
        contractIndex: contractIndex,
        inputType: inputType,
        inputSize: inputSize,
        requestData: requestData,
    }
}

export const HM25_CONTRACT_INDEX = 12

export const PROC_TOPUP = 1
export const PROC_WITHDRAW = 2
export const PROC_UPDATE_PROVIDER = 3
export const PROC_PROCESS_REQUEST = 4

export const FUNC_GET_USER = 1



export async function buildTopUpTx(qHelper, sourcePublicKey, tick, amount) {
    const finalTick = tick + TICK_OFFSET
    const INPUT_SIZE = 0
    const TX_SIZE = qHelper.TRANSACTION_SIZE + INPUT_SIZE
    const tx = new Uint8Array(TX_SIZE).fill(0)
    const dv = new DataView(tx.buffer)

    let offset = 0
    tx.set(sourcePublicKey, offset)
    offset += qHelper.PUBLIC_KEY_LENGTH
    tx[offset] = HM25_CONTRACT_INDEX
    offset += qHelper.PUBLIC_KEY_LENGTH
    dv.setBigInt64(offset, BigInt(amount), true)
    offset += 8
    dv.setUint32(offset, finalTick, true)
    offset += 4
    dv.setUint16(offset, PROC_TOPUP, true)
    offset += 2
    dv.setUint16(offset, INPUT_SIZE, true)

    return tx
}

export async function buildWithdrawTx(qHelper, sourcePublicKey, tick, amount) {
    const finalTick = tick + TICK_OFFSET
    const INPUT_SIZE = 8
    const TX_SIZE = qHelper.TRANSACTION_SIZE + INPUT_SIZE
    const tx = new Uint8Array(TX_SIZE).fill(0)
    const dv = new DataView(tx.buffer)

    let offset = 0
    tx.set(sourcePublicKey, offset)
    offset += qHelper.PUBLIC_KEY_LENGTH
    tx[offset] = HM25_CONTRACT_INDEX
    offset += qHelper.PUBLIC_KEY_LENGTH
    dv.setBigInt64(offset, BigInt(0), true)
    offset += 8
    dv.setUint32(offset, finalTick, true)
    offset += 4
    dv.setUint16(offset, PROC_WITHDRAW, true)
    offset += 2
    dv.setUint16(offset, INPUT_SIZE, true)
    offset += 2
    dv.setBigInt64(offset, BigInt(amount), true)
    return tx
}


export async function buildUpdateProviderTx(qHelper, sourcePublicKey, tick, priceInput, priceOutput, burnRate) {
    const finalTick = tick + TICK_OFFSET
    const INPUT_SIZE = 24
    const TX_SIZE = qHelper.TRANSACTION_SIZE + INPUT_SIZE
    const tx = new Uint8Array(TX_SIZE).fill(0)
    const dv = new DataView(tx.buffer)

    let offset = 0
    tx.set(sourcePublicKey, offset)
    offset += qHelper.PUBLIC_KEY_LENGTH
    tx[offset] = HM25_CONTRACT_INDEX
    offset += qHelper.PUBLIC_KEY_LENGTH
    dv.setBigInt64(offset, BigInt(0), true)
    offset += 8
    dv.setUint32(offset, finalTick, true)
    offset += 4
    dv.setUint16(offset, PROC_UPDATE_PROVIDER, true)
    offset += 2
    dv.setUint16(offset, INPUT_SIZE, true)
    offset += 2
    dv.setBigInt64(offset, BigInt(priceInput), true)
    offset += 8
    dv.setBigInt64(offset, BigInt(priceOutput), true)
    offset += 8
    dv.setBigInt64(offset, BigInt(burnRate), true)
    return tx
}

export async function buildProcessRequestTx(qHelper, sourcePublicKey, tick, provider_id, user_id, token_input, token_output )
{
    const finalTick = tick + TICK_OFFSET
    const INPUT_SIZE = 80
    const TX_SIZE = qHelper.TRANSACTION_SIZE + INPUT_SIZE
    const tx = new Uint8Array(TX_SIZE).fill(0)
    const dv = new DataView(tx.buffer)

    const provider_identity_bytes = qHelper.getIdentityBytes(provider_id) //Uint8Array<ArrayBufferLike>
    const user_identity_bytes = qHelper.getIdentityBytes(user_id) //Uint8Array<ArrayBufferLike>

    let offset = 0
    tx.set(sourcePublicKey, offset)
    offset += qHelper.PUBLIC_KEY_LENGTH
    tx[offset] = HM25_CONTRACT_INDEX
    offset += qHelper.PUBLIC_KEY_LENGTH
    dv.setBigInt64(offset, BigInt(0), true)
    offset += 8
    dv.setUint32(offset, finalTick, true)
    offset += 4
    dv.setUint16(offset, PROC_PROCESS_REQUEST, true)
    offset += 2
    dv.setUint16(offset, INPUT_SIZE, true)
    offset += 2
    tx.set(provider_identity_bytes, offset);
    offset += 32
    tx.set(provider_identity_bytes, offset);
    offset += 32
    dv.setBigInt64(offset, BigInt(token_input), true)
    offset += 8
    dv.setBigInt64(offset, BigInt(token_output), true)
    return tx
}

export async function fetchUserBalance(httpEndpoint, qHelper, ID) {
    const identityBytes = qHelper.getIdentityBytes(ID);

    const base64Encoded = Buffer.from(identityBytes).toString("base64");
    const queryData = makeJsonData(
        HM25_CONTRACT_INDEX,
        FUNC_GET_USER,
        32,
        base64Encoded
    );
    const response = await fetch(`${httpEndpoint}/v1/querySmartContract`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(queryData),
    });
    if (!response.ok) {
        return { balance: 0n }
    }
    const json = await response.json();
    if (!json.responseData) {
        return { balance: 0n }
    }

    const raw = base64.decode(json.responseData);
    const buf = Buffer.from(raw, "binary");

    return { balance: buf.readBigUInt64LE(0) }
}