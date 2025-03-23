import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer'
import base64 from 'base-64'
import {QubicHelper} from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

export const HEADERS = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
}

export const makeJsonData = (contractIndex: any, inputType: any, inputSize: any, requestData: any) => {
    return {
        contractIndex: contractIndex,
        inputType: inputType,
        inputSize: inputSize,
        requestData: requestData,
    }
}

export const HM25_CONTRACT_INDEX = 12
export const FUNCTION_ID = 1

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const ID = searchParams.get('ID')

    const helper = new QubicHelper()
    const identityBytes = helper.getIdentityBytes(ID!)

    const base64Encoded = Buffer.from(identityBytes).toString('base64')
    const queryData = makeJsonData(HM25_CONTRACT_INDEX, FUNCTION_ID, 32, base64Encoded)
    const response = await fetch(`http://46.17.103.110/v1/querySmartContract`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(queryData),
    })
    if (!response.ok) {
        return NextResponse.error()
    }
    const json = await response.json()
    if (!json.responseData) {
        return NextResponse.error()
    }

    const raw = base64.decode(json.responseData)
    const buf = Buffer.from(raw, 'binary')

    return NextResponse.json({ balance: buf.readBigUInt64LE(0).toString() });
}

