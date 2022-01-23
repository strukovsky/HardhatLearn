const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");

describe("LisingToken", function () {
    it("Should be deployed successfully", async function () {
        const LisingToken = await ethers.getContractFactory("LisingToken");
        const lising = await LisingToken.deploy();

        expect(await lising.deployed());
        this.lising = lising;
    });

    describe("Should support lising functionalities", function () {
        before(function () {
            this.tokenAddress = utils.getAddress('0x08d2c94f47b5ca3c3193e599276aabf24aadc9a1');
            this.ownerAddress = utils.getAddress('0x2653a9f5f5b7cf25Bc2c0ec85A3574B87224bDa3');
        });

        describe("Should correctly add new lising", function(){
            it("add new lising", async function () {
                const lisingEnd = new Date('10.12.2025');
                await this.lising.initLising(this.ownerAddress, this.tokenAddress, lisingEnd.getTime(), 1000);
                const lisingData = await this.lising.getLising(this.ownerAddress);
                expect(lisingData[0]).to.be.eq(this.tokenAddress);
                expect(lisingData[2]).to.be.eq(lisingEnd.getTime());
                expect(lisingData[3]).to.be.eq(1000);
                expect(lisingData[4]).to.be.eq(false);
            });
    
            it("declines adding incorrect date lising", async function(){
                const badLisingEnd = new Date('10.11.1987');
                const adding = this.lising.initLising(this.ownerAddress, this.tokenAddress, badLisingEnd.getTime(), 100);
                await expect(adding).to.be.revertedWith('Lising is already presented');
            });

            it("declines adding already presented lising", async function(){
                const badLisingEnd = new Date('10.11.1987');
                const adding = this.lising.initLising(this.ownerAddress, this.tokenAddress, badLisingEnd.getTime(), 100);
                await expect(adding).to.be.revertedWith('Lising is already presented');
            });
        });

        describe("Should correctly prolongate a lising", function(){
            it("prolongates a lising with correct date", async function () {
                const newLisingEnd = new Date('11.12.2030');
                this.lising.prolongateLising(this.ownerAddress, newLisingEnd.getTime());
            });
            
            it("does not prolongate with earlier date", async function () {
                const newBadLisingEnd = new Date('1.10.2010');
                const prolongation = this.lising.prolongateLising(this.ownerAddress, newBadLisingEnd.getTime());
                await expect(prolongation).to.be.revertedWith('New lising end date must be greater than old one');
            });

        });

        describe("Should correctly abort a lising", function(){
            it("aborts a lising", async function(){
                await this.lising.abortLising(this.ownerAddress);
                const isAborted = await this.lising.getLising(this.ownerAddress);
                expect(isAborted[4]).to.be.true;
            });

            it("declines abortion for a non-existing lising", async function(){
                const badAbortion = this.lising.abortLising('0xa0b3a79cf7d4d1203b9d7b702755c18b4c5524cc');
                await expect(badAbortion).to.be.revertedWith("There is no such lising");
            });

            it("declines abortion for already aborted lising", async function(){
                const badAbortion = this.lising.abortLising(this.ownerAddress);
                await expect(badAbortion).to.be.revertedWith("Should not be already aborted");
            });
        });
    });

});