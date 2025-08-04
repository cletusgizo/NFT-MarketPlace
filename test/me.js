// describe("BlockMarketPlace Test Suite", () => {
//   describe("Deployment", () => {
//     it("Should return set values upon deployment", async () => {
//       const { marketplace, owner_ } = await loadFixture(deployBlockMarketPlace);
//       expect(await marketplace.marketOwner()).to.eq(owner_);
//     });
//   });

//   describe("Listing", () => {
//     it("Should list Nft accordingly", async () => {
//       const { marketplace, addr1, BlockToken, blocknft } = await loadFixture(
//         deployBlockMarketPlace
//       );
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);
//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100000,
//         sold: false,
//         minOffer: 10,
//       });

//       expect(await blocknft.ownerOf(tokenId)).to.eq(
//         await marketplace.getAddress()
//       );
//     });

//     it("Should revert upon setting unaccepted values", async () => {
//       const { marketplace, addr1, BlockToken, blocknft } = await loadFixture(
//         deployBlockMarketPlace
//       );
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);
//       let tx1 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 0,
//         sold: false,
//         minOffer: 10,
//       });

//       await expect(tx1).to.be.revertedWith("Invalid price");
//       //   tx2
//       let tx2 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 10000,
//         sold: false,
//         minOffer: 0,
//       });

//       await expect(tx2).to.be.revertedWith("Invalid min offer");

//       //   tx3
//       let tx3 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10000,
//         sold: false,
//         minOffer: 10,
//       });

//       await expect(tx3).to.be.revertedWith("ERC20 Payment is not supported");

//       let ZeroAddress = "0x0000000000000000000000000000000000000000";
//       marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10000,
//         sold: false,
//         minOffer: 10,
//       });

//       let [, , paymentToken, , ,] = await marketplace.getListing(1);
//       // console.log(paymentToken);

//       expect(await paymentToken).to.eq(ZeroAddress);
//     });
//   });

//   describe("BuyNFT", () => {
//     it("Should revert if the NFT is already sold", async () => {
//       const { marketplace, blocknft, BlockToken, owner_, addr1, addr2, addr3 } =
//         await loadFixture(deployBlockMarketPlace);
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);
//       let listId = 0;
//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 500,
//         sold: false,
//         minOffer: 250,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);
//       await marketplace.connect(addr2).buyNft(listId);
//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr2.address);
//       expect((await marketplace.getListing(listId)).sold).to.equal(true);

//       await BlockToken.connect(owner_).transfer(addr3.address, 500);
//       await BlockToken.connect(addr3).approve(marketplace.getAddress(), 500);

//       await expect(
//         marketplace.connect(addr3).buyNft(listId)
//       ).to.be.revertedWith("ALready Sold");
//     });

//     it("Should buy successfully with ERC20 token", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);
//       expect(await BlockToken.balanceOf(addr2.address)).to.eq(1000);

//       await marketplace.connect(addr2).buyNft(listId);
//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr2.address);
//       expect((await marketplace.getListing(listId)).sold).to.equal(true);
//     });

//     it("Should buy successfully with native ETH", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).buyNft(listId, {
//         value: 10,
//       });

//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr2.address);
//       expect((await marketplace.getListing(listId)).sold).to.equal(true);
//     });

//     it("Should revert if price is incorrect", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await expect(
//         marketplace.connect(addr2).buyNft(listId, {
//           value: 3,
//         })
//       ).to.be.revertedWith("Incorrect price");
//     });
//   });

//   describe("Offers", () => {
//     it("Should revert if offer is placed for an already sold listing", async () => {
//       const { marketplace, addr1, blocknft, addr2, addr3 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 1000,
//         sold: false,
//         minOffer: 500,
//       });

//       await marketplace.connect(addr2).buyNft(listId, {
//         value: 1000,
//       });

//       await expect(
//         marketplace.connect(addr3).offer(listId, 700)
//       ).to.be.revertedWith("Already sold");
//     });

//     it("Should revert if msg.value is less than MinOffer", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await expect(
//         marketplace.connect(addr2).offer(listId, 0, { value: 4 })
//       ).to.be.revertedWith("Invalid offer");
//     });

//     it("Should revert if offerAmount is not 0 when offering with native ETH", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await expect(
//         marketplace.connect(addr2).offer(listId, 6, { value: 7 })
//       ).to.be.revertedWith("Cannot offer erc20");
//     });

//     it("Should check that offerAmount == msg.value when offering with native ETH", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).offer(listId, 0, { value: 7 });

//       expect((await marketplace.getOffer(0)).offerAmount).to.eq(7);
//     });

//     it("Should check that offerAmount >= MinOffer", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);

//       await marketplace.connect(addr2).offer(listId, 10);
//       expect((await marketplace.getOffer(0)).offerAmount).to.eq(10);

//       await expect(
//         marketplace.connect(addr2).offer(listId, 5)
//       ).to.be.revertedWith("Invalid offer");
//     });

//     it("Should check that msg.sender != listing owner", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let t it("Should revert if offer is placed for an already sold listing", async () => {
//       const { marketplace, addr1, blocknft, addr2, addr3 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 1000,
//         sold: false,
//         minOffer: 500,
//       });

//       await marketplace.connect(addr2).buyNft(listId, {
//         value: 1000,
//       });

//       await expect(
//         marketplace.connect(addr3).offer(listId, 700)
//       ).to.be.revertedWith("Already sold");
//     });okenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await expect(
//         marketplace.connect(addr1).offer(listId, 0, { value: 7 })
//       ).to.be.revertedWith("Owner cannot offer");
//     });
//   });

//   describe("AcceptOffers", () => {
//     it("Should revert if owner is not msg.sender", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).offer(listId, 0, { value: 7 });

//       await expect(
//         marketplace.connect(addr2).acceptOffer(0)
//       ).to.be.revertedWith("Unauthorized seller");

//       await marketplace.connect(addr1).acceptOffer(0);
//     });

//     it("Should revert if listing is already sold", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).offer(listId, 0, { value: 7 });

//       await marketplace.connect(addr1).acceptOffer(0);

//       await expect(
//         marketplace.connect(addr1).acceptOffer(0)
//       ).to.be.revertedWith("Already Sold");
//     });

//     it("Should accept offer placed with ERC20 token succcesfully", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);

//       await marketplace.connect(addr2).offer(listId, 10);
//       await marketplace.connect(addr1).acceptOffer(0);

//       expect((await marketplace.getOffer(0)).status).to.eq(true);
//     });
//   });

//   describe("CancelOffers", () => {
//     it("Should revert if trying to cancel already accepted offer", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);

//       await marketplace.connect(addr2).offer(listId, 10);
//       await marketplace.connect(addr1).acceptOffer(0);

//       await expect(
//         marketplace.connect(addr2).cancelOffer(0)
//       ).to.be.revertedWith("Offer already accepted");
//     });

//     it("Should revert if not offerer trying to cancel offer", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await BlockToken.connect(owner_).mint(2000, owner_);
//       await BlockToken.connect(owner_).transfer(addr2.address, 1000);
//       await BlockToken.connect(addr2).approve(marketplace.getAddress(), 1000);

//       await marketplace.connect(addr2).offer(listId, 10);

//       await expect(
//         marketplace.connect(addr1).cancelOffer(0)
//       ).to.be.revertedWith("Unauthorized offerrer");

//       await marketplace.connect(addr2).cancelOffer(0);
//     });

//     it("Should cancel offer successfully", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).offer(listId, 0, { value: 7 });

//       await marketplace.connect(addr2).cancelOffer(0);
//     });
//   });

//   describe("CancelListings", () => {
//     it("Should revert if unauthorized user tries to cancel listing", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await expect(
//         marketplace.connect(addr2).cancelListing(listId)
//       ).to.be.revertedWith("Unauthorized user");
//     });

//     it("Should revert if lister tries to cancel sold listing", async () => {
//       const { marketplace, addr1, blocknft, addr2 } = await loadFixture(
//         deployBlockMarketPlace
//       );

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;
//       let ZeroAddress = "0x0000000000000000000000000000000000000000";

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10,
//         sold: false,
//         minOffer: 5,
//       });

//       await marketplace.connect(addr2).buyNft(listId, {
//         value: 10,
//       });

//       await expect(
//         marketplace.connect(addr1).cancelListing(listId)
//       ).to.be.revertedWith("Already sold");
//     });

//     it("Should successfully cancel listing", async () => {
//       const { marketplace, addr1, BlockToken, blocknft, addr2, owner_ } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       let listId = 0;

//       await marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 100,
//         sold: false,
//         minOffer: 10,
//       });

//       await marketplace.connect(addr1).cancelListing(listId);

//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr1.address);
//     });
//   });
// });
// ```;

// sold: false,
//         minOffer: 10,
//       });

//       await marketplace.connect(addr1).cancelListing(listId);

//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr1.address);
//     });
//   });
// });
// ```;

// sold: false,
//         minOffer: 10,
//       });

//       await marketplace.connect(addr1).cancelListing(listId);

//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr1.address);
//     });
//   });
// });
// ```;

// const {
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// // const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect, assert } = require("chai");
// const { ethers } = require("hardhat");
// const { bigint } = require("hardhat/internal/core/params/argumentTypes");

// // util functon
// const deployBlockMarketPlace = async () => {
//   // target the BlockMarketPlace contract within our contract folder
//   const [owner_, addr1, addr2] = await ethers.getSigners();
//   const BlockMarketPlaceContract = await ethers.getContractFactory(
//     "BlockMarketPlace"
//   ); // target BlockMarketPlace.sol
//   const BlockNftContract = await ethers.getContractFactory("BlockNft");
//   const BlockTokenContract = await ethers.getContractFactory("BlockToken");
//   let name_ = "BlockToken";
//   let symbol_ = "BCT";
//   const BlockToken = await BlockTokenContract.deploy(
//     name_,
//     symbol_,
//     owner_.address
//   ); // deploy the BlockToken contract
//   const blocknft = await BlockNftContract.deploy();
//   const marketplace = await BlockMarketPlaceContract.connect(owner_).deploy();
//   // deploy the BlockMarketPlace contract
//   return { marketplace, blocknft, BlockToken, owner_, addr1, addr2 }; // return the deployed instance of our BlockMarketPlace contract
// };

// describe("BlockMarketPlace Test Suite", () => {
//   describe("Deployment", () => {
//     it("Should return set values upon deployment", async () => {
//       const { marketplace, owner_ } = await loadFixture(deployBlockMarketPlace);
//       expect(await marketplace.marketOwner()).to.eq(owner_);
//     });
//   });

//   describe("Listing", () => {
//     it("Should revert upon setting unaccepted values", async () => {
//       const { marketplace, addr1, BlockToken, blocknft } = await loadFixture(
//         deployBlockMarketPlace
//       );
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);
//       let tx1 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 0,
//         sold: false,
//         minOffer: 10,
//       });

//       await expect(tx1).to.be.revertedWith("Invalid price");
//       //   tx2
//       let tx2 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: false,
//         price: 10000,
//         sold: false,
//         minOffer: 0,
//       });

//       await expect(tx2).to.be.revertedWith("Invalid min offer");

//       //   tx3
//       let tx3 = marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10000,
//         sold: false,
//         minOffer: 10,
//       });

//       await expect(tx3).to.be.revertedWith("ERC20 Payment is not supported");

//       let ZeroAddress = "0x0000000000000000000000000000000000000000";
//       marketplace.connect(addr1).listNft({
//         owner: addr1,
//         tokenId: tokenId,
//         paymentToken: ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 10000,
//         sold: false,
//         minOffer: 10,
//       });

//       let [, , paymentToken, , ,] = await marketplace.getListing(1);
//       console.log(paymentToken);

//       expect(await paymentToken).to.eq(ZeroAddress);
//     });
//   });

//   describe("Buying", () => {
//     it("Should buy Nft using ERC20 Token", async () => {
//       const { marketplace, owner_, addr2, addr1, BlockToken, blocknft } =
//         await loadFixture(deployBlockMarketPlace);

//       let tokenId = 1;
//       let listId = 0;

//       const marketplaceAddress = await marketplace.getAddress();
//       const blocknftAddress = await blocknft.getAddress();

//       await blocknft.connect(addr1).mint(addr1);
//       await BlockToken.connect(owner_).mint(2000, addr2.address);
//       let token = await ethers.getContractAt("IERC20", BlockToken);

//       await blocknft.connect(addr1).setApprovalForAll(marketplaceAddress, true);

//       await BlockToken.connect(addr2).approve(marketplaceAddress, 2000);

//       await marketplace.connect(addr1).listNft({
//         owner: addr1.address,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknftAddress,
//         isNative: false,
//         price: 1000,
//         sold: false,
//         minOffer: 100,
//       });

//       await marketplace.connect(addr2).buyNft(listId);
//       // Verify results
//       expect(await BlockToken.balanceOf(addr2.address)).to.eq(1000);
//       expect(await BlockToken.balanceOf(addr1.address)).to.eq(970);
//       expect(await blocknft.ownerOf(tokenId)).to.eq(addr2.address);
//     });

//     it("Should let user buy an NFT Using Native ETH", async () => {
//       const { marketplace, addr1, addr2, blocknft, BlockToken } =
//         await loadFixture(deployBlockMarketPlace);
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);

//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       await marketplace.connect(addr1).listNft({
//         owner: addr1.address,
//         tokenId: tokenId,
//         paymentToken: ethers.ZeroAddress,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: ethers.parseEther("1"),
//         sold: false,
//         minOffer: ethers.parseEther("0.1"),
//       });

//       await marketplace
//         .connect(addr2)
//         .buyNft(0, { value: ethers.parseEther("1") });
//     });

//     it("Should revert if the NFT is already sold", async () => {
//       const { marketplace, owner_, addr1, addr2, blocknft, BlockToken } =
//         await loadFixture(deployBlockMarketPlace);
//       let tokenId = 1;
//       await blocknft.connect(addr1).mint(addr1);
//       await BlockToken.connect(owner_).mint(2000, addr2.address);
//       let token = await ethers.getContractAt("IERC20", BlockToken);
//       await blocknft
//         .connect(addr1)
//         .setApprovalForAll(marketplace.getAddress(), true);

//       await marketplace.connect(addr1).listNft({
//         owner: addr1.address,
//         tokenId: tokenId,
//         paymentToken: token,
//         NftToken: blocknft.getAddress(),
//         isNative: true,
//         price: 1000,
//         sold: false,
//         minOffer: 200,
//       });

//       await marketplace.connect(addr2).buyNft(0, 1000);

//       await expect(
//         marketplace.connect(addr2).buyNft(0, 1000)
//       ).to.be.revertedWith("ALready Sold");
//     });
//     // it("Should revert if price is zero", async () => {
//     //   const { marketplace, addr1, blocknft } = await loadFixture(
//     //     deployBlockMarketPlace
//     //   );
//     //   let tokenId = 1;
//     //   await blocknft.connect(addr1).mint(addr1);
//     //   await blocknft
//     //     .connect(addr1)
//     //     .setApprovalForAll(marketplace.getAddress(), true);

//     //   marketplace.connect(addr1).listNft({
//     //     owner: addr1.address,
//     //     tokenId: tokenId,
//     //     paymentToken: ethers.ZeroAddress,
//     //     NftToken: blocknft.getAddress(),
//     //     isNative: true,
//     //     price: 0,
//     //     sold: false,
//     //     minOffer: ethers.parseEther("0.1"),
//     //   });
//     //   await expect().to.be.revertedWith("Invalid price");
//     // });
//   });

//   // describe("Offer", () => {
//   //   it("Should allow a user to make a native offer", async () => {
//   //     const { marketplace, owner_, addr2, addr1, BlockToken, blocknft } =
//   //       await loadFixture(deployBlockMarketPlace);

//   //     // List NFT as native
//   //     await blocknft.connect(addr1).mint(addr1);
//   //     await blocknft
//   //       .connect(addr1)
//   //       .setApprovalForAll(marketplace.getAddress(), true);
//   //     await marketplace.connect(addr1).listNft({
//   //       owner: addr1.address,
//   //       tokenId: 1,
//   //       paymentToken: ethers.ZeroAddress,
//   //       NftToken: blocknft.getAddress(),
//   //       isNative: true,
//   //       price: ethers.parseEther("1"),
//   //       sold: false,
//   //       minOffer: ethers.parseEther("0.1"),
//   //     });

//   //     // Make offer
//   //     await expect(
//   //       marketplace
//   //         .connect(addr2)
//   //         .offer(0, 0, { value: ethers.parseEther("0.2") })
//   //     ).to.not.be.reverted;

//   //     // Check offer details
//   //     const offer = await marketplace.getOffer(0);
//   //     expect(offer.offerrer).to.eq(addr2.address);
//   //     expect(offer.offerAmount).to.eq(ethers.parseEther("0.2"));
//   //   });

//   //   it("Should allow a user to make a ERC20 Token offer", async () => {
//   //     const { marketplace, owner_, addr2, addr1, BlockToken, blocknft } =
//   //       await loadFixture(deployBlockMarketPlace);

//   //     let tokenId = 1;
//   //     let listId = 0;
//   //     await blocknft.connect(addr1).mint(addr1);
//   //     await BlockToken.connect(owner_).mint(2000, addr2.address);
//   //     await blocknft
//   //       .connect(addr1)
//   //       .setApprovalForAll(marketplace.getAddress(), true);

//   //     // let ZeroAddress = "0X0000000000000000000000000000000000000000000000000";
//   //     await marketplace.connect(addr1).listNft({
//   //       owner: addr1.address,
//   //       tokenId: tokenId,
//   //       paymentToken: BlockToken.address,
//   //       NftToken: blocknft.address,
//   //       isNative: false,
//   //       price: 700,
//   //       sold: false,
//   //       minOffer: 300,
//   //     });

//   //     console.log({
//   //       paymentToken: BlockToken.address,
//   //       nftToken: blocknft.address,
//   //       marketplace: await marketplace.getAddress(),
//   //     });

//   //     await BlockToken.connect(addr2).approve(marketplace.getAddress(), 400);

//   //     // Make offer
//   //     await expect(marketplace.connect(addr2).offer(listId, 400)).to.not.be
//   //       .reverted;

//   //     // Check offer details
//   //     const offer = await marketplace.getOffer(listId);
//   //     expect(offer.offerrer).to.eq(addr2.address);
//   //     expect(offer.offerAmount).to.eq(400);
//   //   });
//   // });
// });
